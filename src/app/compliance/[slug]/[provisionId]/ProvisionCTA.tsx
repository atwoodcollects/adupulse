'use client';

export default function ProvisionCTA({ townName }: { townName: string }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold mb-1">
        Stay Updated on {townName} ADU Rules
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Get notified when this town updates its bylaw, the AG issues a decision, or enforcement practices change.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
          window.location.href = `mailto:nick@adupulse.com?subject=${encodeURIComponent(`Compliance alert signup: ${townName}`)}&body=${encodeURIComponent(`Please add me to ${townName} bylaw update alerts.\n\nEmail: ${email}`)}`;
        }}
        className="flex gap-2 flex-col sm:flex-row"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shrink-0"
        >
          Subscribe
        </button>
      </form>
      <p className="text-gray-600 text-xs mt-2">
        Free alerts. No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
