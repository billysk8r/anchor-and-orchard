import React from 'react';
import Navbar from '@/components/Navbar';

interface FilingData {
  tax_prd_yr: number;
  totassetsend: number;
  invstmntinc: number | null;
  othrinvstinc: number | null;
}

interface ProPublicaOrgResponse {
  organization: {
    ein: string;
    name: string;
    city: string;
    state: string;
  };
  filings_with_data: FilingData[];
}

async function getTreasuryBenchmark(): Promise<number> {
  try {
    const currentYear = new Date().getFullYear();
    const res = await fetch(
      `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_bill_rates&field_tdr_date_value=${currentYear}`,
      { next: { revalidate: 3600 } }
    );
    const xml = await res.text();

    // Regex to find 4-week yield. Treasury returns data ascending by date.
    const yieldMatches = Array.from(xml.matchAll(/<d:ROUND_B1_YIELD_4WK_2[^>]*>([\d.]+)<\/d:ROUND_B1_YIELD_4WK_2>/g));
    
    if (yieldMatches.length > 0) {
      // Take the most recent sample
      const latestYield = parseFloat(yieldMatches[yieldMatches.length - 1][1]);
      return latestYield / 100; 
    }
    return 0.035; 
  } catch (e) {
    console.error("Treasury fetch failed", e);
    return 0.035;
  }
}

async function getOrgData(ein: string): Promise<ProPublicaOrgResponse> {
  const res = await fetch(`https://projects.propublica.org/nonprofits/api/v2/organizations/${ein}.json`, {
    next: { revalidate: 86400 } 
  });
  if (!res.ok) throw new Error('Failed to fetch organization');
  return res.json() as Promise<ProPublicaOrgResponse>;
}

export default async function OrgPage({ params }: { params: Promise<{ ein: string }> }) {
  const resolvedParams = await params;
  
  const [data, benchmarkRate] = await Promise.all([
    getOrgData(resolvedParams.ein),
    getTreasuryBenchmark()
  ]);

  const org = data.organization;
  const latestFiling = data.filings_with_data?.find(f => f.totassetsend > 0) || data.filings_with_data?.[0];

  const assets = latestFiling?.totassetsend || 0;
  const currentYield = (latestFiling?.invstmntinc || 0) + (latestFiling?.othrinvstinc || 0);
  const currentBps = assets > 0 ? (currentYield / assets) * 10000 : 0;
  
  const potentialIncome = assets * benchmarkRate;
  const yieldGap = potentialIncome - currentYield;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-left border-b border-slate-200 dark:border-slate-800 pb-8">
          <h1 className="text-4xl font-extrabold mb-2 leading-tight">{org.name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 font-medium text-lg">
            <span>{org.city}, {org.state}</span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span>EIN: {org.ein}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Total Assets ({latestFiling?.tax_prd_yr})</div>
            <div className="text-2xl font-bold">${assets.toLocaleString()}</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Income</div>
            <div className="text-2xl font-bold">${currentYield.toLocaleString()}</div>
          </div>
          
          <div className={`p-6 rounded-2xl border shadow-sm ${
            currentBps < 10 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Current Yield</div>
            <div className={`text-3xl font-bold ${currentBps < 10 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
              {currentBps.toFixed(2)} bps
            </div>
          </div>
        </div>

        <div className="text-left">
           <h2 className="text-2xl font-bold mb-6">Stewardship Analysis</h2>
           
           {assets === 0 ? (
             <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl italic text-slate-500">
               No financial data available for this organization to calculate yield.
             </div>
           ) : currentBps < 10 ? (
             <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-sm">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="max-w-xl">
                    <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400 mb-3">Yield Opportunity Identified</h3>
                    <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed text-lg">
                      This organization is performing below the <span className="font-bold underline">10 basis point</span> benchmark. 
                      By shifting assets to a benchmark rate of <span className="font-bold">{(benchmarkRate * 100).toFixed(2)}%</span> (current 4-week Treasury yield), you could unlock significant extra funding.
                    </p>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm text-center min-w-[200px]">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-1">Potential Annual Impact</div>
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      +${Math.floor(yieldGap).toLocaleString()}
                    </div>
                 </div>
               </div>
             </div>
           ) : (
             <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
               <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                 This organization is maintaining a healthy yield above the 10bps benchmark. 
                 Consistent stewardship is in place for these liquid assets.
               </p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}