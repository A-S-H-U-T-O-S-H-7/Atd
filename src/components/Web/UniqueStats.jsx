'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const stats = [
  { label: 'App Downloads', value: '1Mn+', icon: '📱' },
  { label: 'Loans Given', value: '7Mn+', icon: '💰' },
  { label: 'Amount Disbursed', value: '₹2Cr+', icon: '💸' },
  { label: 'Users', value: '1Mn+', icon: '🤝' }
];

export default function UniqueStats() {
  return (
    <section className="relative bg-[#f5e3df] overflow-hidden py-6 px-4 sm:px-8">
      {/* Enhanced Abstract Background Shape */}
      <div className="absolute inset-0 z-0 opacity-60">
        <svg className="w-full h-full" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path 
            d="M0,100 C120,50 240,180 360,120 C480,60 600,90 720,150 C840,210 960,70 1080,100 C1200,130 1320,180 1440,120 L1440,400 L0,400 Z" 
            fill="url(#gradient)" 
            fillOpacity="0.3"
          />
          <path 
            d="M0,150 C160,100 320,200 480,150 C640,100 800,170 960,150 C1120,130 1280,80 1440,150 L1440,400 L0,400 Z" 
            fill="url(#gradient)" 
            fillOpacity="0.2"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Animated Particles */}
      <div className="absolute top-6 left-8 text-indigo-400 animate-pulse z-10">
        <Sparkles size={16} />
      </div>
      <div className="absolute bottom-6 right-10 text-purple-400 animate-bounce z-10">
        <Sparkles size={14} />
      </div>
      <div className="absolute top-16 right-1/4 text-pink-400 animate-pulse z-10">
        <Sparkles size={18} />
      </div>

      {/* Stats Cards */}
      <div className="relative z-20 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.15
            }}
            viewport={{ once: true }}
            className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm px-3 py-4 text-center border border-slate-100"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-lg font-semibold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}