import React from 'react';
import { Container } from '../ui/container';

export default function FinalCTA() {
  return (
    <section className="bg-[#FAF8F5] py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-[#171717] px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-16 ">

          {/* Subtle ambient glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#C65D3A]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#C65D3A]/[0.06] blur-3xl" />

          {/* Decorative rings */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.05]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/[0.04]" />

          <div className="relative mx-auto max-w-2xl">

            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#0F6B56]">
              Ready to make sense of it?
            </p>

            <h2 className="text-2xl font-semibold leading-[1.08] tracking-tight text-white sm:text-3xl lg:text-[40px]">
              Your idea deserves more than a pile of notes.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
              Turn the rough idea in your head into clear workflows,
              connected logic, and the scenarios you might have missed.
            </p>

            <div className="mt-9">

              <a
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C65D3A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(198,93,58,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B95332]"
              >
                Start unfolding
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>

            </div>

            <p className="mt-4 text-xs text-white/30">
              Start with an idea. Figure out the rest as you go.
            </p>

          </div>
        </div>
      </Container>
    </section>
  );
}