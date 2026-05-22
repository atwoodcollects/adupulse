import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Municipal Responsiveness | ADU Pulse',
  description: 'Non-emergency service request data from Commonwealth Connect municipalities, offering context on municipal capacity.',
}

export default function ResponsivenessPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="" />
      <main className="px-5 py-16 max-w-[620px] mx-auto text-center">
        <p className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Coming soon</p>
        <h1 className="text-2xl font-medium text-white mb-4">Municipal responsiveness</h1>
        <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
          Non-emergency service request data from participating Commonwealth Connect municipalities, offering context on municipal capacity. 14 communities, 311 data layer.
        </p>
      </main>
      <Footer />
    </div>
  )
}
