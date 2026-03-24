'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronRight, Download, Play, Shield, Navigation } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150'
];

export default function CinematicLandingPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Navbar appearance
    gsap.fromTo('.nav-element', 
      { y: -20, opacity: 0, autoAlpha: 0 },
      { y: 0, opacity: 1, autoAlpha: 1, duration: 1, stagger: 0.08, ease: 'power3.out' }
    );

    // Hero Text Sequence
    gsap.fromTo('.hero-part', 
      { y: 40, opacity: 0, autoAlpha: 0 },
      { y: 0, opacity: 1, autoAlpha: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );

    // Avatars Pop-In
    gsap.fromTo('.floating-avatar', 
      { scale: 0, opacity: 0, autoAlpha: 0, rotation: -15 },
      { scale: 1, opacity: 1, autoAlpha: 1, rotation: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(2)', delay: 0.8 }
    );

    // Ambient floating for avatars (Clause effect)
    gsap.utils.toArray('.floating-avatar').forEach((el: any) => {
      gsap.to(el, {
        y: 'random(-12, 12)',
        x: 'random(-12, 12)',
        rotation: 'random(-5, 5)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2 // allow entry anim to finish
      });
    });

    // CTA Reveal
    gsap.fromTo('.hero-cta', 
      { y: 20, opacity: 0, autoAlpha: 0 },
      { y: 0, opacity: 1, autoAlpha: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 1.2 }
    );

    // Grid fade in
    gsap.fromTo('.bg-grid', 
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power1.inOut' }
    );
  }, { scope: container });

  return (
    <div ref={container} className="relative min-h-screen font-sans">
      
      {/* Navbar Container */}
      <div className="absolute top-0 left-0 right-0 z-40 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between">
        {/* Logo */}
        <div className="nav-element flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-[#0A261D] flex items-center justify-center text-[#FDFDFC] transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110">
            <span className="text-xl leading-none -mt-0.5">⛽</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0A261D]">PetroApply</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-[15px]">
          {['Features', 'Students', 'Companies', 'Pricing'].map((item) => (
            <span key={item} className="nav-element cursor-pointer hover:opacity-70 transition-opacity">
              {item}
            </span>
          ))}
        </nav>

        {/* Nav Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="nav-element hidden md:block font-medium text-[15px] hover:opacity-70 transition-opacity">
            Admin Portal
          </Link>
          <button className="nav-element bg-[#073624] text-white px-6 py-2.5 rounded-full font-medium text-[15px] flex items-center gap-2 hover:bg-[#031d13] hover:scale-[1.03] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-lg shadow-[#073624]/20">
            Download App
          </button>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] pt-24 pb-20 px-4 text-center">
        
        {/* Floating Avatars (Clause specific design) */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto w-full">
          {/* Avatar 1 - Top Left */}
          <div className="floating-avatar absolute top-[15%] left-[5%] md:left-[12%] z-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-2 bg-white/60 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50">
                <img src={AVATARS[0]} alt="Student" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#0A261D] text-[#FDFDFC] p-1.5 rounded-br-lg rounded-tl-lg rounded-tr-sm rounded-bl-sm transform rotate-45">
                <Navigation size={14} className="-rotate-45" />
              </div>
            </div>
          </div>

          {/* Avatar 2 - Bottom Left */}
          <div className="floating-avatar absolute bottom-[15%] left-[8%] md:left-[18%] hidden sm:block z-0">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-2 bg-white/60 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50">
                <img src={AVATARS[1]} alt="Recruiter" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -top-2 -right-4 bg-[#0A261D] text-[#FDFDFC] p-1.5 rounded-bl-lg rounded-tr-lg rounded-tl-sm rounded-br-sm transform rotate-[135deg]">
                <Navigation size={14} className="-rotate-[135deg]" />
              </div>
            </div>
          </div>

          {/* Avatar 3 - Bottom Right */}
          <div className="floating-avatar absolute top-[65%] right-[5%] md:right-[15%] z-0">
            <div className="relative">
              <div className="w-28 h-28 rounded-full p-2 bg-white/60 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50">
                <img src={AVATARS[2]} alt="Professional" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -top-4 -left-2 bg-[#0A261D] text-[#FDFDFC] p-1.5 rounded-bl-lg rounded-tr-lg rounded-tl-sm rounded-br-sm transform -rotate-45">
                <Navigation size={14} className="rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Small Eyebrow Label */}
        <div className="hero-part relative z-10 bg-white border border-gray-200 px-4 py-1.5 rounded-full flex items-center gap-2 mb-10 shadow-sm">
          <Shield size={14} className="text-[#073624]" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#073624]">Built For Engineering</span>
        </div>

        {/* Hero Headline */}
        <h1 className="hero-part relative z-10 max-w-4xl mx-auto text-[40px] leading-[1.15] md:text-[64px] md:leading-[1.1] font-extrabold tracking-[-0.03em] mb-8">
          One platform to <span className="relative inline-block">
            navigate
            {/* The Green Underline */}
            <svg className="absolute w-full h-[14px] -bottom-[4px] left-0 text-[#B2F042]" viewBox="0 0 200 14" fill="none" preserveAspectRatio="none">
              <path d="M2.38048 11.2335C30.9576 6.30798 107.82 1.34005 197.669 3.08985" stroke="#CAF271" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span> <br className="hidden md:block" />
          your engineering career
        </h1>

        {/* Sub-headline */}
        <p className="hero-part relative z-10 max-w-2xl mx-auto text-lg text-gray-500 mb-12 font-medium leading-relaxed">
          PetroApply helps engineering students track applications, discover top energy companies, and mitigate rejection with data-driven recruitment insights.
        </p>

        {/* Call To Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full justify-center px-4">
          <button className="hero-cta w-full sm:w-auto bg-[#073624] text-white px-8 py-4 rounded-2xl font-semibold text-[17px] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(7,54,36,0.5)]">
            <Download size={20} className="mr-2" />
            Download APK
          </button>
          <Link href="/login" className="hero-cta w-full sm:w-auto bg-white border-2 border-gray-100 text-[#0A261D] px-8 py-4 rounded-2xl font-semibold text-[17px] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03] hover:border-gray-200 shadow-sm">
            Admin Access
            <ChevronRight size={20} className="ml-1 opacity-70" />
          </Link>
        </div>

      </main>

      {/* Logos Section */}
      <div className="absolute bottom-6 left-0 right-0 z-20 px-6 hero-cta hidden md:flex items-center justify-center gap-12 opacity-60 grayscale overflow-hidden">
        <span className="font-medium text-sm text-[#0A261D] whitespace-nowrap hidden lg:block mr-4">
          Trusted by Top Firms
        </span>
        <div className="flex items-center gap-12 font-bold text-xl tracking-tight">
          <span>CHEVRON</span>
          <span>EXXONMOBIL</span>
          <span>SCHLUMBERGER</span>
          <span>BP GROUP</span>
        </div>
      </div>

    </div>
  );
}
