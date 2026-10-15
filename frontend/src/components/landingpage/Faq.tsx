"use client"
import React, { useState } from 'react';
import { Container } from '../ui/container';

const faqs = [
  { question: 'What exactly does Unfold help me do?', answer: 'Unfold takes a rough product idea and helps turn it into structured product logic. It identifies the people involved, maps their workflows, surfaces missing scenarios and edge cases, and helps you refine the result into something you can actually build from.' },
  { question: 'Do I need to have my product fully figured out first?', answer: 'No. That is the point. You can start with a rough idea, a messy description, or even a half-formed concept. Unfold helps you work through what is missing instead of expecting you to have everything figured out beforehand.' },
  { question: 'What happens when something is unclear?', answer: 'Unfold does not simply guess and move on. When an important part of the product is unclear or contradictory, it can surface the issue and ask you to clarify it before continuing.' },
  { question: 'Can I change the workflows Unfold creates?', answer: 'Yes. The generated workflows are a starting point, not a final answer. You can review, edit, refine, and answer questions as your understanding of the product develops.' },
  { question: 'Is Unfold a replacement for a PRD?', answer: 'Not exactly. Unfold focuses on the logic underneath the product — who does what, how different flows connect, and what can go wrong. The result can then become a much stronger foundation for your PRD, design, and development work.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="bg-[#FAF8F5] py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

          <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#0F6B56]">FAQ</p>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-main leading-[1.15] tracking-tight">
              Questions before you unfold?
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#666666]">
              A few things you might want to know before turning your
              next product idea into something clearer.
            </p>
          </div>

          <div className="border-t border-stone-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="border-b border-stone-200">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold leading-relaxed text-main sm:text-base">
                      {faq.question}
                    </span>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${isOpen ? 'border-brand bg-brand text-white' : 'border-stone-300 bg-transparent text-stone-500'}`}>
                      <span className="relative block h-3 w-3">
                        <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                        <span className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                      </span>
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-[#666666]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}