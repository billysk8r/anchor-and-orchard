'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface OrgSuggestion {
  ein: number;
  name: string;
  city: string;
  state: string;
}

interface SearchResponse {
  organizations?: OrgSuggestion[];
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<OrgSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = (await res.json()) as SearchResponse;
          setSuggestions(data.organizations?.slice(0, 6) || []);
          setShowDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 md:py-24 text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-[120px] h-[120px]">
          <Image 
            src="/logo_theme_aware.svg" 
            alt="Logo" 
            width={120} 
            height={120} 
            priority 
            className="block h-auto" 
          />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
        Data-Driven Stewardship.
      </h1>
      <p className="text-xl md:text-2xl mb-12 text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
        Identify underperforming cash management in nonprofits—finding the &quot;hidden yield&quot; to fuel your mission.
      </p>
      
      <div className="relative max-w-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl focus-within:ring-2 ring-blue-500 transition-all">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Organization Name..." 
            className="w-full md:flex-1 p-4 rounded-xl bg-transparent focus:outline-none text-lg text-slate-900 dark:text-white"
          />
          <button className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all whitespace-nowrap">
            {loading ? 'Searching...' : 'Calculate Yield Gap'}
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div ref={dropdownRef} className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden text-left">
            {suggestions.map((org) => (
              <button
                key={org.ein}
                onClick={() => router.push(`/org/${org.ein}`)}
                className="w-full p-4 hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
              >
                <span className="font-bold text-slate-900 dark:text-white">{org.name}</span>
                <span className="text-sm text-slate-500">{org.city}, {org.state} • EIN: {org.ein}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}