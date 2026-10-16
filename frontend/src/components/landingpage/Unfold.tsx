import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/container';
import { Button } from '../ui/button';

export default function UnfoldSection() {
  return (
    <section id="about" className="relative scroll-mt-24 bg-surface py-12 sm:py-16 lg:py-20 border-t border-border overflow-hidden">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-4">
          <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F6B56]">
            The idea is simple. Until you unfold it.
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-main leading-[1.15] tracking-tight">
            Where your product ideas come together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-center">

          <div className="lg:col-span-5 space-y-6 sm:space-y-8 z-10 text-center lg:text-left">
            <p className="text-sm text-muted leading-relaxed max-w-md mx-auto lg:mx-0">
              Most products start with a simple idea. The happy path is easy, but Unfold helps you discover the hidden complexity, edge cases, and workflows around it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white font-medium text-sm rounded-full px-7 py-3.5 transition-colors shadow-sm"
              >
                <Link href="/signup" className="flex items-center justify-center gap-2">
                  <span>Get started</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full sm:w-auto text-main hover:bg-black/5 font-medium text-sm rounded-full px-5 py-3 transition-colors"
              >
                <Link href="#features">See features</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 relative z-10">
            <div className="relative bg-surface rounded-3xl border border-border shadow-2xl shadow-brand/10 overflow-hidden">

              <div className="relative bg-[#FAF8F5] p-5 sm:p-6 md:p-8 min-h-[380px] sm:min-h-[440px] md:min-h-[500px] flex flex-col justify-center bg-[radial-gradient(#E5E0D8_1px,transparent_1px)] [background-size:16px_16px]">

                <div className="hidden sm:block absolute inset-0 pointer-events-none z-0">
                  <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                    <path d="M 210 200 C 260 200, 270 90, 340 90" stroke="#C65D3A" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 210 200 C 260 200, 270 200, 340 200" stroke="#C65D3A" strokeWidth="2.5" />
                    <path d="M 210 200 C 260 200, 270 310, 340 310" stroke="#C65D3A" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">

                  <div className="sm:col-span-5">
                    <div className="bg-surface rounded-2xl p-4 sm:p-5 shadow-md border-2 border-brand transition-transform hover:-translate-y-0.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand/10 text-brand text-[11px] font-bold mb-2">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18h6" />
                          <path d="M10 22h4" />
                          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A5.5 5.5 0 1010 9.5" />
                          <path d="M12 3v0a5.5 5.5 0 00-2.5 10.5c.76.76 1.23 1.52 1.41 2.5" />
                        </svg>
                        Idea
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-main leading-snug">
                        "Marketplace for photographers."
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-7 space-y-3">

                    <div className="bg-surface/90 backdrop-blur-sm rounded-xl p-3.5 shadow-xs border border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand">People</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-main">
                        <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-border">Customer</span>
                        <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-border">Photographer</span>
                        <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-border">Admin</span>
                      </div>
                    </div>

                    <div className="bg-surface rounded-xl p-3.5 shadow-sm border-2 border-brand/20">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand">Workflows</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      </div>
                      <div className="space-y-1 text-[11px] font-medium text-main">
                        <div className="flex items-center gap-1.5"><span className="text-[#0F6B56]">✓</span> Discover & Search</div>
                        <div className="flex items-center gap-1.5"><span className="text-[#0F6B56]">✓</span> Booking Request</div>
                        <div className="flex items-center gap-1.5"><span className="text-brand"></span> Payment Processing</div>
                      </div>
                    </div>

                    <div className="bg-surface/90 backdrop-blur-sm rounded-xl p-3.5 shadow-xs border border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand">Edge Cases</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      </div>
                      <p className="text-[10px] text-muted italic bg-[#FAF6F0] p-1.5 rounded border border-border">
                        "What happens if payment fails mid-booking?"
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
