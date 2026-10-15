import React from 'react';
import { Container } from '../ui/container';
import { FiSmartphone, FiMessageCircle, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { TbBrain } from 'react-icons/tb';

export default function IdeaToLogic() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-[#FAF8F5] py-16 sm:py-20 lg:py-24">
      <Container>

        <div className="mx-auto mb-10 sm:mb-14 max-w-2xl space-y-4 text-center">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F6B56]">
            From Scattered Thoughts → Clear Logic
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-[1.15] tracking-tight text-main">
            Stop leaving your product architecture all over the place.
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Your idea usually starts split across five different apps.
            Unfold brings everything together into one structured system.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1.05fr] lg:gap-8">

            <div className="relative min-h-[470px]">
              <div className="mb-5 flex items-center justify-between px-2">
                <span className="text-xs font-bold tracking-[0.14em] text-brand">
                  The Usual Mess
                </span>
                <span className="text-xs text-stone-400">4 places at once</span>
              </div>

              <div className="absolute left-2 top-14 w-[82%] max-w-[320px] -rotate-2 rounded-2xl border border-stone-200 bg-surface p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <FiSmartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-main">Apple Notes</p>
                    <p className="text-[10px] text-stone-400">11:42 PM</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  "Need booking flow for photographers... maybe calendar sync?"
                </p>
              </div>

              <div className="absolute right-0 top-36 w-[82%] max-w-[310px] rotate-2 rounded-2xl border border-stone-200 bg-surface p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FiMessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-main">WhatsApp Chat</p>
                    <p className="text-[10px] text-stone-400">Yesterday</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  "Wait, what if the customer cancels 10 minutes before the shoot??"
                </p>
              </div>

              <div className="absolute bottom-16 left-5 w-[78%] max-w-[300px] rotate-1 rounded-2xl border border-stone-200 bg-surface p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiFileText className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-main">
                    Google Doc <span className="text-stone-400">(v2)</span>
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  "Admin stuff?? Need dashboard to payout photographers somehow."
                </p>
              </div>

              <div className="absolute bottom-0 right-2 w-[75%] max-w-[280px] -rotate-2 rounded-2xl border border-stone-200 bg-[#FFFDF9] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <TbBrain className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-main">In your head</p>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  "I know I'm forgetting at least 3 major edge cases right now..."
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="hidden h-px w-12 bg-stone-300 lg:block" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-brand">
                  <span className="text-lg">→</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand">Unfold</span>
                <div className="hidden h-px w-12 bg-stone-300 lg:block" />
              </div>
            </div>

            <div>
              <div className="relative min-h-[470px] overflow-hidden rounded-[28px] bg-brand p-7 sm:p-9">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/[0.07]" />
                <div className="pointer-events-none absolute -bottom-28 -left-20 h-60 w-60 rounded-full bg-black/[0.04]" />

                <div className="relative flex h-full min-h-[414px] flex-col">
                  <div className="max-w-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
                      Your product, connected
                    </p>
                    <p className="mt-3 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                      The pieces start making sense when you see how they connect.
                    </p>
                  </div>

                  <div className="relative mt-10 flex-1">
                    <div className="absolute left-[25px] top-[35px] h-[210px] w-px bg-white/25" />

                    <div className="relative flex items-center gap-5">
                      <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                          <circle cx="12" cy="8" r="3.5" />
                          <path d="M5 20c.7-3.7 3-5.5 7-5.5s6.3 1.8 7 5.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Customer</p>
                        <p className="mt-0.5 text-xs text-white/60">Finds a photographer</p>
                      </div>
                    </div>

                    <div className="relative mt-7 flex items-center gap-5">
                      <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                          <rect x="4" y="5" width="16" height="15" rx="2" />
                          <path d="M8 3v4M16 3v4M4 9h16" />
                          <path d="M8 13h3M8 16h5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Booking</p>
                        <p className="mt-0.5 text-xs text-white/60">Selects a date and locks the slot</p>
                      </div>
                    </div>

                    <div className="relative mt-7 flex items-center gap-5">
                      <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                          <rect x="3" y="6" width="18" height="13" rx="2" />
                          <path d="M3 10h18" />
                          <path d="M7 15h3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Payment</p>
                        <p className="mt-0.5 text-xs text-white/60">Payment is held until the booking is complete</p>
                      </div>
                    </div>

                    <div className="relative mt-7 flex items-center gap-5">
                      <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                          <path d="M4 8h4l1.5-2h5L16 8h4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Photographer</p>
                        <p className="mt-0.5 text-xs text-white/60">Completes the booking and receives payout</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/20 bg-white/[0.10] p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                        <span className="font-bold">!</span>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.14em] text-white/55">Unfold catches the gap</p>
                        <p className="mt-1 text-sm font-semibold text-white">What happens if the customer cancels?</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/60">
                          A 50% refund rule is added before the workflow is considered complete.
                        </p>
                      </div>
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