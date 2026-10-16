import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/container';

const UsersIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const TargetIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);
const ZapIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const QuestionIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" />
    <path d="M12 17h.01" />
  </svg>
);
const SparkleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
  </svg>
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-12 sm:py-16 lg:py-20 border-t border-border overflow-hidden">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F6B56]">
            How Unfold Works
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-main leading-[1.15] tracking-tight">
            From a raw thought to complete product logic
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Three simple steps to map out every workflow, user role, and hidden edge case before you build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">

          <div className="md:col-span-5 relative bg-[#EBF5EE] rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] overflow-hidden group transition-all duration-300">
            <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-[#C2ECE1] opacity-60 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-main tracking-tight">
                Start with the idea in your head
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-xs">
                Tell Unfold what you're trying to build, even if it's rough, incomplete, or just a single sentence.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <div className="bg-surface/90 backdrop-blur-sm p-3 rounded-xl text-xs text-muted italic">
                "A marketplace where people can book photographers..."
              </div>
            </div>
          </div>

          <div className="md:col-span-7 relative bg-[#F3EFEF] rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] overflow-hidden group transition-all duration-300">
            <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none">
              <svg className="w-28 h-28 text-brand" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                <rect x="10" y="10" width="25" height="25" rx="4" />
                <rect x="65" y="10" width="25" height="25" rx="4" />
                <rect x="65" y="65" width="25" height="25" rx="4" />
                <path d="M35 22.5 H65 M77.5 35 V65" strokeDasharray="4 4" />
              </svg>
            </div>
            <div className="relative z-10 space-y-2 max-w-md">
              <h3 className="text-lg sm:text-xl font-semibold text-main tracking-tight">
                Unfold people, goals & workflows
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Unfold identifies every person involved (customers, photographers, admins), their primary goals, and the necessary step-by-step product workflows.
              </p>
            </div>
          </div>

          <div className="md:col-span-7 relative bg-[#FDE8D0]/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[260px] overflow-hidden group transition-all duration-300">
            <div className="absolute right-4 bottom-2 opacity-30 group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <svg className="w-40 h-40 text-brand" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="50" cy="50" r="20" />
                <circle cx="50" cy="50" r="35" />
                <circle cx="50" cy="50" r="48" />
              </svg>
            </div>
            <div className="relative z-10 space-y-2 max-w-md">
              <h3 className="text-lg sm:text-xl font-semibold text-main tracking-tight">
                Discover what you missed
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                It questions the gaps, edge cases, cancellations, and critical technical decisions you haven't considered yet—before your users bump into them.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <span className="inline-flex items-center gap-1.5 bg-surface/90 px-3 py-1.5 rounded-lg text-xs font-medium text-brand">
              "What happens if a photographer cancels 1 hour before the shoot?"
              </span>
            </div>
          </div>

          <div className="md:col-span-5 relative bg-[#FCF6E5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[260px] overflow-hidden group transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#F2C94C]/30 pointer-events-none" />
            <div className="relative z-10 space-y-2">
             
              <h3 className="text-lg sm:text-xl font-semibold text-main">
                Clear product clarity
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                No fluff. Just structured product requirements that give you and your team absolute confidence.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <Link href="#how-it-works" className="inline-flex items-center gap-2 text-sm font-bold text-main hover:text-brand transition-colors">
                <span>See how it works</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
