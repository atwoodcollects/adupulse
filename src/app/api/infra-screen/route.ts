import { NextRequest, NextResponse } from 'next/server'
import { MA_POTW_LOOKUP } from '@/data/ma-potw-lookup'

const MASSGIS_SEWER_URL = 'http://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL/DEP_SEWER_SERVICE_AREAS/FeatureServer/2'
const MASSGIS_WATER_URL = 'http://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL/DEP_PWS_WATER_SERVICE_AREAS/FeatureServer/2'
const MASSGIS_WETLANDS_URL = 'http://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL/DEP_Wetlands/FeatureServer/1'
const FEMA_FLOOD_URL = 'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28'
const MASSGIS_MBTA_URL = 'http://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL/MBTA_Commuter_Rail/FeatureServer/0'

async function geocode(address: string): Promise<{ lat: number; lng: number; display: string }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Massachusetts')}&format=json&limit=1&countrycodes=us`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ADUPulse/1.0 (adupulse.com)', 'Accept-Language': 'en-US' }
  })
  const data = await res.json()
  if (!data.length) throw new Error('Address not found')
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name }
}

async function queryMassGIS(serviceUrl: string, lat: number, lng: number) {
  const params = new URLSearchParams({
    geometry: JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }),
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    outSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: 'false',
    f: 'json',
  })
  const res = await fetch(`${serviceUrl}/query?${params}`)
  const text = await res.text()
  console.log('[infra-screen] raw response status:', res.status, 'url:', serviceUrl)
  console.log('[infra-screen] raw response body:', text.slice(0, 500))
  const data = JSON.parse(text)
  if (data.error) throw new Error(`MassGIS error: ${data.error.message}`)
  return data.features ?? []
}

async function getSewerCapacity(permitId: string) {
  if (!permitId) return null
  const params = new URLSearchParams({
    output: 'JSON',
    p_id: permitId,
    responseset: '1',
  })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)
  try {
    const text = await (await fetch(
      `https://echodata.epa.gov/echo/cwa_rest_services.get_facility_info?${params}`,
      { signal: controller.signal }
    )).text()
    clearTimeout(timeout)
    const data = JSON.parse(text)
    const facilities = data?.Results?.Facilities
    if (!facilities || facilities.length === 0) return null
    const f = facilities[0]
    return {
      permitId,
      facilityName: f.CWPName ?? null,
      actualFlowMGD: f.CWPActualAverageFlowNmbr ? parseFloat(f.CWPActualAverageFlowNmbr) : null,
      permitStatus: f.CWPPermitStatusDesc ?? null,
      npdesId: f.SourceID ?? null,
    }
  } catch (e) {
    clearTimeout(timeout)
    return null
  }
}

async function queryMBTAStations(lat: number, lng: number) {
  const geometry = JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } })
  const params = new URLSearchParams({
    geometry,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    outSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    distance: '8046',
    units: 'esriSRUnit_Meter',
    outFields: 'STATION,LINE_BRNCH',
    returnGeometry: 'true',
    f: 'json',
  })
  const text = await (await fetch(`${MASSGIS_MBTA_URL}/query?${params}`)).text()
  const data = JSON.parse(text)
  if (data.error) throw new Error(`MassGIS error: ${data.error.message}`)
  return data.features ?? []
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  if (!address) return NextResponse.json({ error: 'address required' }, { status: 400 })

  try {
    const geo = await geocode(address)

    const [sewerResult, waterResult, wetlandsResult, floodResult, mbtaResult] = await Promise.allSettled([
      queryMassGIS(MASSGIS_SEWER_URL, geo.lat, geo.lng),
      queryMassGIS(MASSGIS_WATER_URL, geo.lat, geo.lng),
      queryMassGIS(MASSGIS_WETLANDS_URL, geo.lat, geo.lng),
      queryMassGIS(FEMA_FLOOD_URL, geo.lat, geo.lng),
      queryMBTAStations(geo.lat, geo.lng),
    ])

    let sewerCapacity = null
    if (sewerResult.status === 'fulfilled' && sewerResult.value.length > 0) {
      const attrs = sewerResult.value[0]?.attributes
      const permitId = (attrs?.ORIG_PERMIT_ID && attrs.ORIG_PERMIT_ID !== '<Null>')
        ? attrs.ORIG_PERMIT_ID
        : attrs?.PERMIT_ID
      if (permitId && MA_POTW_LOOKUP[permitId]) {
        const record = MA_POTW_LOOKUP[permitId]
        sewerCapacity = {
          permitId,
          facilityName: record.name,
          designFlowMGD: record.designFlowMGD,
          actualFlowMGD: record.actualFlowMGD,
          permitStatus: record.permitStatus,
          headroomMGD: (record.designFlowMGD != null && record.actualFlowMGD != null)
            ? Math.round((record.designFlowMGD - record.actualFlowMGD) * 100) / 100
            : null,
        }
      }
    }

    let nearestStation = null
    if (mbtaResult.status === 'fulfilled' && mbtaResult.value.length > 0) {
      const withDistance = mbtaResult.value.map((f: any) => ({
        ...f,
        distanceMiles: haversineMiles(geo.lat, geo.lng, f.geometry.y, f.geometry.x)
      }))
      withDistance.sort((a: any, b: any) => a.distanceMiles - b.distanceMiles)
      nearestStation = {
        name: withDistance[0].attributes.STATION,
        line: withDistance[0].attributes.LINE_BRNCH,
        distanceMiles: Math.round(withDistance[0].distanceMiles * 10) / 10
      }
    }

    return NextResponse.json({
      geo,
      sewer: {
        hit: sewerResult.status === 'fulfilled' && sewerResult.value.length > 0,
        features: sewerResult.status === 'fulfilled' ? sewerResult.value : [],
        error: sewerResult.status === 'rejected' ? sewerResult.reason?.message : null,
      },
      water: {
        hit: waterResult.status === 'fulfilled' && waterResult.value.length > 0,
        features: waterResult.status === 'fulfilled' ? waterResult.value : [],
        error: waterResult.status === 'rejected' ? waterResult.reason?.message : null,
      },
      wetlands: {
        hit: wetlandsResult.status === 'fulfilled' && wetlandsResult.value.length > 0,
        features: wetlandsResult.status === 'fulfilled' ? wetlandsResult.value : [],
        error: wetlandsResult.status === 'rejected' ? wetlandsResult.reason?.message : null,
      },
      flood: {
        hit: floodResult.status === 'fulfilled' && floodResult.value.length > 0,
        sfha: floodResult.status === 'fulfilled' && floodResult.value.some((f: any) => f.attributes?.SFHA_TF === 'T'),
        zones: floodResult.status === 'fulfilled' ? floodResult.value.map((f: any) => f.attributes?.FLD_ZONE).filter(Boolean) : [],
        error: floodResult.status === 'rejected' ? floodResult.reason?.message : null,
      },
      mbta: {
        nearestStation,
        error: mbtaResult.status === 'rejected' ? mbtaResult.reason?.message : null,
      },
      sewerCapacity,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
