'use client';

import { useState, useEffect } from 'react';

interface ComplianceGateProps {
  townName: string;
  townSlug: string;
  provisionCount: number;
  isProvisionPage?: boolean;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const ROLE_OPTIONS = [
  'Homeowner',
  'Builder / Contractor',
  'Real Estate Agent',
  'Municipal Staff',
  'Attorney',
  'Developer',
  'Other',
];

export default function ComplianceGate({
  townName,
  townSlug,
  provisionCount,
  isProvisionPage,
}: ComplianceGateProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [interestedTown, setInterestedTown] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'compliance_gate_viewed', {
        event_category: 'conversion',
        event_label: townSlug || townName || 'unknown',
      });
    }
  }, [townSlug, townName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState('submitting');

    try {
      const res = await fetch('/api/compliance-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, town: townSlug, interestedTown }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setFormState('error');
          return;
        }
        throw new Error(data.error || 'Submission failed');
      }

      setFormState('success');
      if (typeof window !== 'undefined') {
        window.gtag?.('event', 'compliance_gate_submitted', {
          event_category: 'conversion',
          event_label: townSlug || townName || 'unknown',
        });
      }
    } catch {
      setFormState('error');
    }
  }

  if (formState === 'success') {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sm:p-8 text-center">
        <div className="text-3xl mb-3">&#10003;</div>
        <h3 className="text-lg font-bold text-white mb-2">
          Thanks — we&apos;ll send the full {townName} analysis to {email} shortly.
        </h3>
        <p className="text-sm text-gray-400">
          Check your inbox for the complete provision-by-provision breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sm:p-8">
      <div className="mb-5">
        {isProvisionPage ? (
          <>
            <h3 className="text-lg font-bold text-white mb-2">
              Detailed Provision Analysis
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              This provision analysis is part of our detailed compliance review for {townName}. Get the full breakdown:
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-white mb-2">
              Full Compliance Analysis Available
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We&apos;ve mapped {provisionCount} provisions in {townName}&apos;s ADU bylaw against Massachusetts Chapter 150. Enter your details to get the full provision-by-provision analysis.
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gate-name" className="block text-xs font-medium text-gray-400 mb-1">
            Name
          </label>
          <input
            id="gate-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="gate-email" className="block text-xs font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            id="gate-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="gate-role" className="block text-xs font-medium text-gray-400 mb-1">
            Role
          </label>
          <select
            id="gate-role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="" disabled>Select your role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="gate-town" className="block text-xs font-medium text-gray-400 mb-1">
            Which town matters most to you? <span className="text-gray-600">(optional)</span>
          </label>
          <input
            id="gate-town"
            type="text"
            value={interestedTown}
            onChange={(e) => setInterestedTown(e.target.value)}
            placeholder="e.g. Brookline, Newton..."
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="w-full px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {formState === 'submitting' ? 'Submitting...' : 'Get the Full Analysis'}
        </button>

        {formState === 'error' && (
          <p className="text-sm text-red-400 text-center">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
