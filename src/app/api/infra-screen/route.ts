import { NextRequest, NextResponse } from 'next/server'

const MASSGIS_SEWER_URL = 'https://services1.arcgis.com/hGdibHYSPO59RG1h/arcgis/rest/services/SEWER_SERVICE_AREA_POTW_POLY/FeatureServer/0'
const MASSGIS_WATER_URL = 'https://services1.arcgis.com/hGdibHYSPO59RG1h/arcgis/rest/services/DRINK_WATER_SERVICE_AREA_POLY/FeatureServer/0'

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
  const geometry = JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } })
  const params = new URLSearchParams({
    geometry,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
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

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  if (!address) return NextResponse.json({ error: 'address required' }, { status: 400 })

  try {
    const geo = await geocode(address)

    const [sewerResult, waterResult] = await Promise.allSettled([
      queryMassGIS(MASSGIS_SEWER_URL, geo.lat, geo.lng),
      queryMassGIS(MASSGIS_WATER_URL, geo.lat, geo.lng),
    ])

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
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
