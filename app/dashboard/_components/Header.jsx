"use client";

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false); // Close mobile menu on route change
  }, [pathname]);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "FAQs", href: "/faq" },
    { label: "How it works?", href: "/how-it-works" }
  ];

  const navLinkStyle = (href) =>
    `text-gray-800 text-base md:text-lg hover:text-blue-600 hover:font-bold transition-all duration-300 ${
      pathname === href ? 'font-bold text-blue-600' : ''
    }`;

  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-4 sm:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src="/logo5.png" alt="logo" width={120} height={50} priority />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 hover:text-blue-600 transition"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Center Navigation (Desktop) */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={navLinkStyle(href)}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: User Button */}
        <div className="flex-shrink-0 hidden md:block">
          <UserButton />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 mt-2 px-4 pt-4 pb-2 space-y-3">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={`${navLinkStyle(href)} block`}>
              {label}
            </Link>
          ))}
          <div className="pt-3">
            <UserButton />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
