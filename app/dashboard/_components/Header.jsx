"use client";

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect } from 'react';

function Header() {
  const pathname = usePathname();
  
  useEffect(() => {
    console.log('Current Path:', pathname);
  }, [pathname]);

  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="relative container mx-auto flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <Image src="/logo5.png" alt="logo" width={120} height={50} />
        </div>
        
        {/* Center Navigation */}
        <nav className="absolute inset-x-0 flex justify-center">
          <ul className="hidden md:flex space-x-8">
            <li className={`text-gray-800 text-lg text-center hover:text-blue-600 hover:font-bold transition-all duration-300 cursor-pointer ${
              pathname === '/dashboard' ? 'font-bold text-blue-600' : ''
            }`}>
              <Link href="/dashboard" className="block w-full h-full">
                Dashboard
              </Link>
            </li>
            <li className={`text-gray-800 text-lg text-center hover:text-blue-600 hover:font-bold transition-all duration-300 cursor-pointer ${
              pathname === '/faq' ? 'font-bold text-blue-600' : ''
            }`}>
              <Link href="/faq" className="block w-full h-full">
                FAQs  
              </Link>
            </li>
            <li className={`text-gray-800 text-lg text-center hover:text-blue-600 hover:font-bold transition-all duration-300 cursor-pointer ${
              pathname === '/how-it-works' ? 'font-bold text-blue-600' : ''
            }`}>
              <Link href="/how-it-works" className="block w-full h-full">
                How it works?
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Right Section: User Button */}
        <div className="flex-shrink-0">
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default Header;