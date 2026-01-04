import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Retrieving Live IRS Filings</h2>
        <p className="text-slate-500">Streaming 2025 XML indices. This may take up to 20 seconds...</p>
      </main>
    </div>
  );
}