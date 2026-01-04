import React from 'react';
import Navbar from '@/components/Navbar';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
          Ready to discover your organization&apos;s hidden yield?
        </p>
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-lg mb-6">Reach out to our data team at:</p>
          <a href="mailto:hello@anchorandorchard.org" className="text-2xl font-bold text-blue-600 hover:underline">
            hello@anchorandorchard.org
          </a>
        </div>
      </main>
    </div>
  );
}