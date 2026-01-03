import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          {/* Wrapper with fixed dimensions to prevent layout shift */}
          <div className="w-[32px] h-[32px] flex-shrink-0">
            <Image 
              src="/logo_theme_aware.svg" 
              alt="Anchor & Orchard Logo" 
              width={32} 
              height={32} 
              priority
              className="block"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">Anchor & Orchard</span>
        </div>
        <div className="space-x-8 hidden md:flex font-medium">
          <a href="/about" className="hover:text-blue-500 transition">About</a>
          <a href="/contact" className="hover:text-blue-500 transition">Contact</a>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-24 text-center">
        {/* Hero Section Logo */}
        <div className="mb-8 flex justify-center">
            {/* Wrapper with fixed dimensions to prevent hero layout shift */}
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
        
        {/* Search/Calculator Input Area */}
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

        {/* Value Props */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
            <div className="text-blue-500 font-bold mb-2">01. The 10bps Threshold</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">We flag organizations where investment income divided by net assets falls below 10 basis points.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
            <div className="text-blue-500 font-bold mb-2">02. Big Data Analysis</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Our local engine parses thousands of 990 & 990EZ filings to pinpoint underdeveloped strategies.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
            <div className="text-blue-500 font-bold mb-2">03. Mission Growth</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Maximize your mission by reclaiming lost interest and dividends without increasing donor ask.</p>
          </div>
        </div>
      </main>

      <footer className="p-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Anchor & Orchard. All rights reserved.
      </footer>
    </div>
  );
}