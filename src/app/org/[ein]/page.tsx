import React from 'react';
import Navbar from '@/components/Navbar';
import { getIrsData } from '@/lib/irs';

async function getTreasuryRate(): Promise<number> {
  try {
    const res = await fetch(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_bill_rates&field_tdr_date_value=${new Date().getFullYear()}`, { next: { revalidate: 3600 } });
    const xml = await res.text();
    const matches = Array.from(xml.matchAll(/<d:ROUND_B1_YIELD_4WK_2[^>]*>([\d.]+)<\/d:ROUND_B1_YIELD_4WK_2>/g));
    return matches.length > 0 ? parseFloat(matches[matches.length - 1][1]) / 100 : 0.045;
  } catch { return 0.045; }
}

export default async function OrgPage({ params }: { params: Promise<{ ein: string }> }) {
  const { ein } = await params;
  
  // Call local function directly - No network request to self!
  const [benchmarkRate, irsData] = await Promise.all([
    getTreasuryRate(),
    getIrsData(ein)
  ]);

  if (irsData.error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <main className="max-w-4xl mx-auto p-20 text-center">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Filing Unavailable</h2>
          <p className="text-slate-500 max-w-md mx-auto">{irsData.error}</p>
        </main>
      </div>
    );
  }

  const { cashAssets, investmentIncome, formType, year, name } = irsData;
  const currentBps = cashAssets > 0 ? (investmentIncome / cashAssets) * 10000 : 0;
  const yieldGap = (cashAssets * benchmarkRate) - investmentIncome;
  
  let impactText = "";
  if (yieldGap >= 1000) {
    impactText = `Equivalent to approximately ${Math.floor(yieldGap / 1000)} new $1,000 grants or programs per year.`;
  } else if (yieldGap > 0) {
    impactText = `Equivalent to covering approximately $${Math.floor(yieldGap / 12)} in monthly utility or administrative overhead costs.`;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1] text-balance">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">
              <span>EIN {ein}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span>{formType}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span>FY {year}</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-right min-w-[200px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Yield (T-Bill)</p>
            <p className="text-3xl font-black text-blue-600">{(benchmarkRate * 100).toFixed(2)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
          <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Liquid Assets</p>
            <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">${cashAssets.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-2 italic uppercase">Includes Savings & Cash</p>
          </div>
          
          <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Income</p>
            <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">${investmentIncome.toLocaleString()}</p>
          </div>

          <div className={`p-10 rounded-[2.5rem] text-white shadow-2xl ${currentBps < 10 ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-slate-900'}`}>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-4">Performance</p>
            <p className="text-4xl font-black tracking-tighter">{currentBps.toFixed(2)} bps</p>
          </div>
        </div>

        {currentBps < 10 && yieldGap > 50 ? (
          <div className="relative overflow-hidden bg-emerald-600 text-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl text-left">
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <span className="h-3 w-3 rounded-full bg-emerald-300 animate-pulse"></span>
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-100">Actionable Insight</h2>
               </div>
               <h3 className="text-3xl md:text-4xl font-black mb-6 max-w-2xl leading-tight text-balance">
                 Your cash is currently under-stewarded.
               </h3>
               <p className="text-emerald-50 text-xl mb-12 max-w-2xl leading-relaxed opacity-90">
                 By shifting liquid assets to a strategy matching the {(benchmarkRate * 100).toFixed(2)}% treasury benchmark, this organization could fund more of its mission.
               </p>
               
               <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                 <div className="bg-white text-emerald-700 px-12 py-8 rounded-[2rem] shadow-inner">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Potential Annual Lift</p>
                   <p className="text-5xl font-black tracking-tighter">
                     +${Math.floor(yieldGap).toLocaleString()}
                   </p>
                 </div>
                 {impactText && (
                    <div className="max-w-[250px] text-emerald-100 text-sm leading-relaxed border-l border-emerald-500/50 pl-8 italic">
                      {impactText}
                    </div>
                 )}
               </div>
             </div>
             <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-[100px]"></div>
          </div>
        ) : (
          <div className="p-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3.5rem] text-center">
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Efficient Stewardship</p>
            <p className="text-slate-500 max-w-sm mx-auto">This organization is effectively capturing yield on its liquid assets above the 10 basis point threshold.</p>
          </div>
        )}
      </main>
    </div>
  );
}