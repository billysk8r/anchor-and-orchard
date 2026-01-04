import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-24 text-center">
        <div className="mb-8 flex justify-center">
            <div className="w-[120px] h-[120px]">
              <Image 
                src="/logo_theme_aware.svg" 
                alt="Anchor & Orchard Hero Logo" 
                width={120} 
                height={120} 
                priority
                className="block"
              />
            </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Data-Driven Stewardship.
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We scan Form 990 filings to help nonprofits identify underperforming cash management—finding the &quot;hidden yield&quot; to fuel your mission.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <input 
            type="text" 
            placeholder="Enter Organization Name or EIN..." 
            className="w-full md:flex-1 p-4 rounded-xl bg-transparent focus:outline-none text-lg text-slate-900 dark:text-white"
          />
          <button className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all whitespace-nowrap">
            Calculate Yield Gap
          </button>
        </div>
      </main>

      <footer className="p-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Anchor & Orchard. All rights reserved.
      </footer>
    </div>
  );
}