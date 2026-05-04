"use client";

import { useState, useEffect, useMemo, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Shield, Activity, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ParticleProps {
  particle: {
    id: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
  };
}

const Particle = memo(({ particle }: ParticleProps) => (
  <motion.div
    className="absolute w-1 h-1 bg-green-400 rounded-full"
    style={{
      left: `${particle.left}%`,
      top: `${particle.top}%`,
      willChange: "transform, opacity",
    }}
    animate={{
      y: [0, -100, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: particle.duration,
      repeat: Infinity,
      delay: particle.delay,
      ease: "easeInOut",
    }}
  />
));

import { useRef } from 'react';

const MouseFollower = memo(() => {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (followerRef.current) {
        // Native DOM update for absolute minimum latency (zero React/Framer overhead)
        followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={followerRef}
      className="fixed top-0 left-0 w-12 h-12 -ml-6 -mt-6 bg-green-400/30 rounded-full blur-xl pointer-events-none z-50 mix-blend-screen"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform',
      }}
    />
  );
});

MouseFollower.displayName = 'MouseFollower';

export function HeroSection() {
  const [particles, setParticles] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
    setParticles(generatedParticles);
  }, [isClient]);

  const features = useMemo(() => [
    { icon: Activity, title: "Real-time Detection", desc: "Advanced threat detection algorithms" },
    { icon: Shield, title: "Automated Response", desc: "SOAR playbooks for instant mitigation" },
    { icon: Zap, title: "AI-Powered", desc: "Machine learning for enhanced accuracy" }
  ], []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Interactive Mouse Follower - Self-contained native DOM tracker */}
      {isClient && <MouseFollower />}

      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(60deg,transparent_24%,rgba(57,255,20,0.05)_25%,transparent_26%,transparent_74%,rgba(0,245,255,0.05)_75%,transparent_76%,transparent)] bg-[length:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(57,255,20,0.1)_50%,transparent_100%)]" />
      </div>

      {/* Floating Particles */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <Particle key={p.id} particle={p} />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-center lg:justify-start gap-3 mb-8"
              >
                <div className="relative">
                  <Shield className="h-12 w-12 text-green-400" />
                  <motion.div
                    className="absolute inset-0 blur-sm opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="h-12 w-12 text-green-400" />
                  </motion.div>
                </div>
                <span className="text-4xl md:text-5xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    SentinelX
                  </span>
                </span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-300 mb-8"
              >
                Enterprise cybersecurity platform providing real-time threat detection,
                automated response, and comprehensive security monitoring.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.a
                  href="/login"
                  className={cn(
                    "group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:from-green-400 hover:to-green-500",
                    "transform hover:scale-105 active:scale-95"
                  )}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.a>

                <motion.a
                  href="#platform"
                  className={cn(
                    "group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-semibold text-lg rounded-xl transition-all duration-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600",
                    "transform hover:scale-105 active:scale-95"
                  )}
                >
                  View Platform
                  <Globe className="ml-2 h-5 w-5 transition-transform duration-300" />
                </motion.a>
              </motion.div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <feature.icon className="h-8 w-8 mx-auto mb-3 text-green-400" />
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 min-h-[400px]">
                <h3 className="text-white font-bold text-xl mb-6 text-center">
                  Live Threat Map
                </h3>
                <div className="relative h-64 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                  <span className="text-slate-500 font-medium">Interactive Demo Area</span>
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute border border-slate-700/30 rounded"
                        style={{
                          left: `${20 + (i % 3) * 30}%`,
                          top: `${20 + Math.floor(i / 3) * 30}%`,
                          width: "2px",
                          height: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
