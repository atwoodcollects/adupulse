import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Town data for OG cards
const townData: Record<string, { submitted: number; approved: number; denied: number; rate: number }> = {
  arlington: { submitted: 7, approved: 6, denied: 0, rate: 86 },
  brookline: { submitted: 14, approved: 10, denied: 1, rate: 71 },
  cambridge: { submitted: 31, approved: 22, denied: 3, rate: 73 },
  somerville: { submitted: 40, approved: 24, denied: 6, rate: 63 },
  framingham: { submitted: 8, approved: 6, denied: 1, rate: 75 },
  quincy: { submitted: 17, approved: 6, denied: 4, rate: 43 },
  worcester: { submitted: 31, approved: 23, denied: 2, rate: 77 },
  salem: { submitted: 9, approved: 9, denied: 0, rate: 100 },
  marshfield: { submitted: 24, approved: 11, denied: 4, rate: 52 },
  barnstable: { submitted: 31, approved: 6, denied: 9, rate: 24 },
  boston: { submitted: 69, approved: 44, denied: 8, rate: 67 },
  newton: { submitted: 40, approved: 18, denied: 5, rate: 47 },
  milton: { submitted: 25, approved: 24, denied: 0, rate: 96 },
  plymouth: { submitted: 42, approved: 34, denied: 2, rate: 83 },
  duxbury: { submitted: 3, approved: 2, denied: 0, rate: 67 },
  needham: { submitted: 4, approved: 4, denied: 0, rate: 100 },
  andover: { submitted: 10, approved: 9, denied: 0, rate: 90 },
  sudbury: { submitted: 3, approved: 3, denied: 0, rate: 100 },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const town = searchParams.get('town') || 'massachusetts'
  const type = searchParams.get('type') || 'town' // town, estimate, compare

  const townName = town.charAt(0).toUpperCase() + town.slice(1).replace(/-/g, ' ')
  const data = townData[town.toLowerCase()]

  const stateAvgRate = 69

  if (type === 'estimate') {
    const cost = searchParams.get('cost') || '$285K'
    const roi = searchParams.get('roi') || '127%'

    return new ImageResponse(
      (
        <div style={{
          display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '60px',
          fontFamily: 'system-ui',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ color: '#94a3b8', fontSize: '28px', fontWeight: 600 }}>ADU Pulse</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <div style={{ color: '#60a5fa', fontSize: '24px', marginBottom: '16px', fontWeight: 500 }}>ADU Cost Estimate</div>
            <div style={{ color: '#ffffff', fontSize: '64px', fontWeight: 700, marginBottom: '8px' }}>{cost}</div>
            <div style={{ color: '#94a3b8', fontSize: '28px', marginBottom: '32px' }}>{townName} • {roi} est. 10yr ROI</div>
            <div style={{ color: '#64748b', fontSize: '20px' }}>Based on real Massachusetts permit data → adupulse.com/estimate</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  if (!data) {
    return new ImageResponse(
      (
        <div style={{
          display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '60px',
          fontFamily: 'system-ui',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ color: '#94a3b8', fontSize: '28px', fontWeight: 600 }}>ADU Pulse</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <div style={{ color: '#ffffff', fontSize: '56px', fontWeight: 700, marginBottom: '16px' }}>
              Massachusetts ADU Permits
            </div>
            <div style={{ color: '#94a3b8', fontSize: '28px', marginBottom: '32px' }}>
              Real-time permit data for 217 towns
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#34d399', fontSize: '48px', fontWeight: 700 }}>1,224</span>
                <span style={{ color: '#64748b', fontSize: '20px' }}>Approved</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#ffffff', fontSize: '48px', fontWeight: 700 }}>217</span>
                <span style={{ color: '#64748b', fontSize: '20px' }}>Towns</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const vsAvg = data.rate - stateAvgRate
  const vsLabel = vsAvg > 0 ? `${vsAvg}pt above state avg` : vsAvg < 0 ? `${Math.abs(vsAvg)}pt below state avg` : 'At state avg'

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '60px',
        fontFamily: 'system-ui',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#34d399' }} />
          <span style={{ color: '#94a3b8', fontSize: '28px', fontWeight: 600 }}>ADU Pulse</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ color: '#60a5fa', fontSize: '24px', marginBottom: '12px', fontWeight: 500 }}>ADU Permit Data</div>
          <div style={{ color: '#ffffff', fontSize: '56px', fontWeight: 700, marginBottom: '8px' }}>{townName}</div>
          <div style={{ color: '#94a3b8', fontSize: '24px', marginBottom: '40px' }}>{vsLabel}</div>

          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#ffffff', fontSize: '48px', fontWeight: 700 }}>{data.submitted}</span>
              <span style={{ color: '#64748b', fontSize: '20px' }}>Submitted</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#34d399', fontSize: '48px', fontWeight: 700 }}>{data.approved}</span>
              <span style={{ color: '#64748b', fontSize: '20px' }}>Approved</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: data.rate >= stateAvgRate ? '#34d399' : '#f59e0b', fontSize: '48px', fontWeight: 700 }}>{data.rate}%</span>
              <span style={{ color: '#64748b', fontSize: '20px' }}>Approval Rate</span>
            </div>
          </div>
        </div>

        <div style={{ color: '#475569', fontSize: '18px' }}>adupulse.com/towns/{town.toLowerCase()}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
