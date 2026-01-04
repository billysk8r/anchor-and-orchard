import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2 group" aria-label="Anchor & Orchard Home">
        <div className="w-[32px] h-[32px] flex-shrink-0 transition-transform group-hover:scale-110">
          <Image 
            src="/logo_theme_aware.svg" 
            alt="" 
            width={32} 
            height={32} 
            priority
            style={{ height: 'auto' }} // Added to fix the console warning
            className="block"
          />
        </div>
        <span className="font-bold text-xl tracking-tight">Anchor & Orchard</span>
      </Link>

      <div className="space-x-8 font-medium flex items-center">
        <Link href="/" className="hover:text-blue-500 transition">Home</Link>
        <Link href="/about" className="hover:text-blue-500 transition">About</Link>
        <Link href="/contact" className="hover:text-blue-500 transition">Contact</Link>
      </div>
    </nav>
  );
}