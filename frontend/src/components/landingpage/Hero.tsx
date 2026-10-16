import React from 'react';
import Image from 'next/image';
import { Container } from '../ui/container';
import { Button } from '../ui/button';

const SearchIcon = () => (
  <svg className="w-5 h-5 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const NodeIcon = () => (
  <svg className="w-6 h-6 text-[#0F6B56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a2 2 0 002 2h8a2 2 0 002-2V9" />
  </svg>
);

function DotScatter() {
  const dots: { x: number; y: number; size: number }[] = [];
  const rows = 7;
  const cols = 7;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * 100;
      const y = (r / (rows - 1)) * 100;
      dots.push({ x, y, size: 6 });
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none hidden sm:block opacity-60">
      <div className="absolute top-[35%] left-[25%] w-1.5 h-10 rounded-full bg-[#EC4899]" />
      <div className="absolute top-[50%] left-[58%] w-10 h-1.5 rounded-full bg-[#EC4899]" />
      <div className="absolute top-[18%] right-[30%] w-12 h-1.5 rounded-full bg-[#C65D3A]" />
      <div className="absolute bottom-[28%] right-[40%] w-1.5 h-10 rounded-full bg-[#C65D3A]" />
      <div className="absolute bottom-[18%] left-[42%] w-12 h-1.5 rounded-full bg-[#C65D3A]" />

      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#C65D3A] opacity-75"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative py-10 sm:py-12 md:py-30 overflow-hidden md:min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          <div className="lg:col-span-5 space-y-6 z-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.2] tracking-tight text-main">
              Describe your idea. Discover what you missed.
            </h1>

            <p className="text-sm lg:text-base text-[#666666] max-w-md mx-auto lg:mx-0 leading-relaxed">
              We map out everyone involved in your product and how it should work then find the gaps before your users do.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                href="/signup"
                className="w-full sm:w-auto rounded-full bg-[#0F6B56] px-7 py-3.5 text-white shadow-sm hover:bg-[#0C5847]"
              >
                Get Started
              </Button>

              <Button
                href="#how-it-works"
                variant="landingOutline"
                className="w-full sm:w-auto rounded-full px-6 py-3.5"
              >
                <span>See How It Works</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[270px] sm:min-h-[420px] md:min-h-[480px] flex items-center justify-center overflow-hidden sm:overflow-visible">

            <div className="relative w-[500px] h-[440px] scale-[0.75] sm:scale-100 origin-center">

              <DotScatter />

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 440" fill="none">
                <path d="M 120 120 L 250 220 L 380 120" stroke="#0F6B56" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                <path d="M 250 220 L 150 340" stroke="#C65D3A" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                <path d="M 250 220 L 350 340" stroke="#EC4899" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
              </svg>

              <div className="absolute top-[40px] left-[40px] z-10 flex items-center gap-3 bg-white p-2.5 pr-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80"
                    alt="Team planning"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#181818]">User Journey</span>
                  <span className="block text-[10px] text-[#666666]">Product Map</span>
                </div>
              </div>

              <div className="absolute top-[40px] right-[40px] z-10 flex items-center gap-3 bg-white p-2.5 pr-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=300&q=80"
                    alt="Workflow"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#181818]">Logic Sketch</span>
                  <span className="block text-[10px] text-[#666666]">System Flow</span>
                </div>
              </div>

              <div className="absolute top-[170px] left-[180px] z-20 w-40 h-32 rounded-3xl bg-white border border-[#0F6B56]/20 shadow-md flex flex-col items-center justify-center p-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#C2ECE1] flex items-center justify-center mb-1">
                  <NodeIcon />
                </div>
                <span className="text-xs font-bold text-[#181818]">Idea Mapper</span>
                
              </div>

              <div className="absolute top-[150px] right-[20px] z-20 bg-[#FCE7F3] p-3 rounded-2xl flex items-center gap-2 shadow-sm">
                <SearchIcon />
                <span className="text-xs font-semibold text-[#EC4899]">Gap Found</span>
              </div>

              <div className="absolute bottom-[30px] left-[60px] z-10 flex items-center gap-3 bg-white p-2.5 pr-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80"
                    alt="Wireframe"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#181818]">Wireframe</span>
                  <span className="block text-[10px] text-[#666666]">Structure</span>
                </div>
              </div>

              <div className="absolute bottom-[30px] right-[60px] z-10 flex items-center gap-3 bg-white p-2.5 pr-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80"
                    alt="Roadmap"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#181818]">Roadmap</span>
                  <span className="block text-[10px] text-[#666666]">Execution</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
