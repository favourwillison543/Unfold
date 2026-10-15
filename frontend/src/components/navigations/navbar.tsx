'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { Container } from '../ui/container';
import { Button } from '../ui/button';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8EE] py-3 relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent via-[#0F6B56]/5 to-[#0F6B56]/15 pointer-events-none" />

      <Container className="relative z-10">
        <nav className="flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/log.png"
              alt="logo"
              width={42}
              height={42}
              className="object-contain"
            />
            <span className="font-bold text-xl text-[#181818] tracking-tight">
              UnFold
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A4A4A]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.label === 'Home'
                    ? 'relative py-1 text-[#0F6B56] font-semibold'
                    : 'hover:text-[#0F6B56] transition-colors'
                }
              >
                {link.label}
                {link.label === 'Home' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F6B56] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-sm font-medium text-[#181818] hover:bg-black/5 rounded-full px-4"
            >
              <Link href="/login">Sign in</Link>
            </Button>

            <Button
              className="bg-[#0F6B56] hover:bg-[#0C5847] text-white font-medium text-sm rounded-full px-5 py-2.5 transition-all shadow-xs"
            >
              <Link href="/signup" className="flex items-center gap-1.5">
                <span>Get started</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Open menu"
          >
            <HiMenuAlt3 className="w-6 h-6 text-[#181818]" />
          </button>

        </nav>
      </Container>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#FDF8EE] shadow-xl transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Image src="/log.png" alt="logo" width={36} height={36} className="object-contain" />
              <span className="font-bold text-lg text-[#181818] tracking-tight">UnFold</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Close menu"
            >
              <HiX className="w-6 h-6 text-[#181818]" />
            </button>
          </div>

          <div className="flex flex-col px-5 py-6 gap-1 text-base font-medium text-[#4A4A4A]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={
                  link.label === 'Home'
                    ? 'py-3 text-[#0F6B56] font-semibold border-b border-black/5'
                    : 'py-3 hover:text-[#0F6B56] transition-colors border-b border-black/5'
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 px-5 py-6 mt-auto">
            <Button
              variant="ghost"
              className="w-full text-sm font-medium text-[#181818] hover:bg-black/5 rounded-full px-4 py-2.5 border border-black/10"
            >
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center">
                Sign in
              </Link>
            </Button>

            <Button
              className="w-full bg-[#0F6B56] hover:bg-[#0C5847] text-white font-medium text-sm rounded-full px-5 py-2.5 transition-all shadow-xs"
            >
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-1.5"
              >
                <span>Get started</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}