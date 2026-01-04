import React from 'react';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-8">Our Mission</h1>
      <section className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Millions of dollars in potential mission-critical funding are lost every year to underdeveloped cash management.</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12">The 10bps Gap</h2>
        <p>We use data science to flag organizations where investment income ratios fall below <strong>10 basis points</strong>, helping you shift from passive holding to active stewardship.</p>
      </section>
    </main>
  );
}