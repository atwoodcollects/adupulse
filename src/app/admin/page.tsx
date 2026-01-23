'use client'

import { useEffect, useState } from 'react'
import { supabase, Town } from '@/lib/supabase'

interface PermitForm {
  town_id: string
  address: string
  permit_number: string
  status: string
  adu_type: string
  sqft: string
  bedrooms: string
  estimated_value: string
  applied_date: string
  approved_date: string
  denied_date: string
  required_variance: boolean
  notes: string
  source: string
  source_date: string
}

const emptyForm: PermitForm = {
  town_id: '',
  address: '',
  permit_number: '',
  status: 'applied',
  adu_type: 'unknown',
  sqft: '',
  bedrooms: '',
  estimated_value: '',
  applied_date: '',
  approved_date: '',
  denied_date: '',
  required_variance: false,
  notes: '',
  source: 'foia',
  source_date: new Date().toISOString().split('T')[0],
}

export default function AdminPage() {
  const [towns, setTowns] = useState<Town[]>([])
  const [form, setForm] = useState<PermitForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const ADMIN_PASSWORD = 'adupulse2025'

  useEffect(() => {
    if (authenticated) {
      fetchTowns()
    }
  }, [authenticated])

  async function fetchTowns() {
    const { data } = await supabase.from('towns').select('*').order('name')
    setTowns(data || [])
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      setMessage('Incorrect password')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const permitData = {
      town_id: form.town_id,
      address: form.address || null,
      permit_number: form.permit_number || null,
      status: form.status,
      adu_type: form.adu_type || null,
      sqft: form.sqft ? parseInt(form.sqft) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
      applied_date: form.applied_date || null,
      approved_date: form.approved_date || null,
      denied_date: form.denied_date || null,
      required_variance: form.required_variance,
      notes: form.notes || null,
      source: form.source,
      source_date: form.source_date || null,
    }

    const { error } = await supabase.from('permits').insert([permitData])
    setLoading(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Permit added!')
      setForm({ ...emptyForm, town_id: form.town_id, source: form.source, source_date: form.source_date })
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm">
          <h1 className="font-display text-xl font-bold mb-6">Admin Login</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-surface-raised border border-border rounded px-4 py-2 mb-4 focus:outline-none focus:border-accent" />
          <button type="submit" className="w-full bg-accent hover:bg-accent-bright text-white font-medium py-2 rounded transition-colors">Login</button>
          {message && <p className="text-denied text-sm mt-4">{message}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">Add Permit</h1>
          <a href="/" className="text-text-secondary hover:text-accent text-sm">← Back to Dashboard</a>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Town *</label>
            <select name="town_id" value={form.town_id} onChange={handleChange} required className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent">
              <option value="">Select town...</option>
              {towns.map(town => (<option key={town.id} value={town.id}>{town.name}</option>))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Permit Number</label>
              <input type="text" name="permit_number" value={form.permit_number} onChange={handleChange} placeholder="BP-2025-001" className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Status *</label>
              <select name="status" value={form.status} onChange={handleChange} required className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent">
                <option value="applied">Applied</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">ADU Type</label>
              <select name="adu_type" value={form.adu_type} onChange={handleChange} className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent">
                <option value="unknown">Unknown</option>
                <option value="attached">Attached</option>
                <option value="detached">Detached</option>
                <option value="internal">Internal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Sqft</label>
              <input type="number" name="sqft" value={form.sqft} onChange={handleChange} placeholder="800" className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Bedrooms</label>
              <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="1" className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Est. Value ($)</label>
              <input type="number" name="estimated_value" value={form.estimated_value} onChange={handleChange} placeholder="150000" className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Applied Date</label>
              <input type="date" name="applied_date" value={form.applied_date} onChange={handleChange} className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Approved Date</label>
              <input type="date" name="approved_date" value={form.approved_date} onChange={handleChange} className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Denied Date</label>
              <input type="date" name="denied_date" value={form.denied_date} onChange={handleChange} className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="required_variance" checked={form.required_variance} onChange={handleChange} className="w-4 h-4 rounded border-border bg-surface-raised" />
            <label className="text-sm text-text-secondary">Required variance or special permit</label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Data Source *</label>
              <select name="source" value={form.source} onChange={handleChange} required className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent">
                <option value="foia">FOIA Request</option>
                <option value="manual">Manual Entry</option>
                <option value="state_survey">State Survey</option>
                <option value="scrape">Web Scrape</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Source Date</label>
              <input type="date" name="source_date" value={form.source_date} onChange={handleChange} className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any additional details..." className="w-full bg-surface-raised border border-border rounded px-4 py-2 focus:outline-none focus:border-accent resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-bright disabled:opacity-50 text-white font-medium py-3 rounded transition-colors">
            {loading ? 'Adding...' : 'Add Permit'}
          </button>

          {message && <p className={`text-sm ${message.includes('Error') ? 'text-denied' : 'text-approved'}`}>{message}</p>}
        </form>
      </div>
    </div>
  )
}
