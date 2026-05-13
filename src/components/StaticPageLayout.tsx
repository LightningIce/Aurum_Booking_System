import React from 'react';
import { motion } from 'motion/react';

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  heroImage?: string;
}

export default function StaticPageLayout({ title, subtitle, children, heroImage }: StaticPageLayoutProps) {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[40vh] overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url("${heroImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000'}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-4"
          >
            {subtitle || 'Aurum Grand Hotel'}
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif"
          >
            {title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-16 shadow-sm border border-slate-100"
        >
          <div className="space-y-8 text-slate-600 leading-relaxed [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:text-primary [&>h2]:mt-12 [&>h2]:mb-6 [&>.lead]:text-xl [&>.lead]:font-serif [&>.lead]:italic">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
