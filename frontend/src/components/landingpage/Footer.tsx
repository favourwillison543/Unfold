import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../ui/container';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#FAF8F5]">

      {/* Green ambient gradient */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#0F6B56]/[0.12] via-[#0F6B56]/[0.04] to-transparent" />

      <Container className="relative z-10">
        <div className="border-t border-black/5 pt-10 sm:pt-12">

          {/* Main footer */}
          <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr] sm:gap-8">

            {/* Brand */}
            <div className="max-w-xs">

              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/log.png"
                  alt="UnFold"
                  width={34}
                  height={34}
                  className="object-contain"
                />

                <span className="text-lg font-bold tracking-tight text-[#181818]">
                  UnFold
                </span>
              </Link>

              <p className="mt-3 max-w-[240px] text-xs leading-relaxed text-[#777777]">
                Turn rough product ideas into clear workflows,
                logic, and buildable plans.
              </p>

              <div className="mt-5 flex items-center gap-2.5">

                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[10px] font-semibold text-[#555555] transition-colors hover:border-[#0F6B56]/30 hover:text-[#0F6B56]"
                >
                  X
                </a>

                <a
                  href="#"
                  aria-label="GitHub"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[10px] font-semibold text-[#555555] transition-colors hover:border-[#0F6B56]/30 hover:text-[#0F6B56]"
                >
                  GH
                </a>

              </div>
            </div>

            {/* Product */}
            <div>
              <p className="mb-4 text-xs font-semibold text-[#181818]">
                Product
              </p>

              <div className="flex flex-col gap-3 text-xs text-[#777777]">
                <Link href="#features" className="transition-colors hover:text-[#0F6B56]">
                  Features
                </Link>

                <Link href="#how-it-works" className="transition-colors hover:text-[#0F6B56]">
                  How it works
                </Link>

                <Link href="#templates" className="transition-colors hover:text-[#0F6B56]">
                  Templates
                </Link>

                <Link href="/get-started" className="transition-colors hover:text-[#0F6B56]">
                  Get started
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="mb-4 text-xs font-semibold text-[#181818]">
                Company
              </p>

              <div className="flex flex-col gap-3 text-xs text-[#777777]">
                <Link href="#about" className="transition-colors hover:text-[#0F6B56]">
                  About
                </Link>

                <Link href="/contact" className="transition-colors hover:text-[#0F6B56]">
                  Contact
                </Link>

                <Link href="/faq" className="transition-colors hover:text-[#0F6B56]">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-4 text-xs font-semibold text-[#181818]">
                Legal
              </p>

              <div className="flex flex-col gap-3 text-xs text-[#777777]">
                <Link href="/privacy" className="transition-colors hover:text-[#0F6B56]">
                  Privacy
                </Link>

                <Link href="/terms" className="transition-colors hover:text-[#0F6B56]">
                  Terms
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="mt-10 flex flex-col gap-3 border-t border-black/5 py-5 text-[10px] text-[#999999] sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} UnFold. All rights reserved.
            </p>

            <p>
              Built for people turning ideas into products.
            </p>

          </div>

        </div>
      </Container>
    </footer>
  );
}