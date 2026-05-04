"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Activity, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

interface MouseTrail {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'ripple' | 'glow' | 'star' | 'orbit';
  angle?: number;
  distance?: number;
}

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouseTrail, setMouseTrail] = useState<MouseTrail[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Enhanced mouse trail with multiple effects
      setMouseTrail((prev: MouseTrail[]): MouseTrail[] => {
        const colors = ['#10b981', '#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6'];
        
        const newEffects: MouseTrail[] = [
          {
            x: newPosition.x,
            y: newPosition.y,
            id: Date.now() + Math.random(),
            type: 'ripple' as const,
            size: 8 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
          {
            x: newPosition.x,
            y: newPosition.y,
            id: Date.now() + Math.random() + 1000,
            type: 'glow' as const,
            size: 12 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
          {
            x: newPosition.x,
            y: newPosition.y,
            id: Date.now() + Math.random() + 2000,
            type: 'star' as const,
            size: 6 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * 360,
          },
          {
            x: newPosition.x,
            y: newPosition.y,
            id: Date.now() + Math.random() + 3000,
            type: 'orbit' as const,
            size: 4 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: 0,
            distance: 0,
          }
        ];
        
        const updated = [...prev, ...newEffects];
        return updated.slice(-30);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate orbiting particles
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setMouseTrail(prev => 
        prev.map((particle): MouseTrail => {
          if (particle.type === 'orbit') {
            return {
              ...particle,
              angle: (particle.angle || 0) + 5,
              distance: Math.min((particle.distance || 0) + 1, 30),
            };
          }
          return particle;
        })
      );
    }, 50); // 20 FPS for orbit animation

    return () => clearInterval(interval);
  }, [isClient]);

  // Clean up old trail effects
  useEffect(() => {
    if (!isClient) return;

    const cleanup = setInterval(() => {
      setMouseTrail(prev => 
        prev.filter(particle => {
          const age = Date.now() - particle.id;
          return age < 2000; // Keep effects for 2 seconds
        })
      );
    }, 100);

    return () => clearInterval(cleanup);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const generatedParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 6,
      delay: Math.random() * 4,
    }));
    setParticles(generatedParticles);
  }, [isClient]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(60deg,transparent_24%,rgba(57,255,20,0.05)_25%,transparent_26%,transparent_74%,rgba(0,245,255,0.05)_75%,transparent_76%,transparent)] bg-[length:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(57,255,20,0.1)_50%,transparent_100%)]" />
        
        {/* Enhanced animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #8b5cf6 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #f59e0b 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Enhanced Floating Particles */}
      {isClient && (
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-green-400/30"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: '2px',
                height: '2px',
              }}
              animate={{
                y: [0, -50, -25, 0],
                x: [0, 20, -10, 0],
                opacity: [0, 0.8, 0.4, 0],
                scale: [0, 1.2, 1, 1.2],
                rotate: [0, 180, 360, 180, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Super Enhanced Mouse Trail */}
      {isClient && mouseTrail.map((effect) => {
        const age = Date.now() - effect.id;
        const opacity = Math.max(0, 1 - (age / 2000));
        
        if (effect.type === 'ripple') {
          return (
            <motion.div
              key={effect.id}
              className="absolute pointer-events-none"
              style={{
                left: effect.x - effect.size / 2,
                top: effect.y - effect.size / 2,
                width: effect.size,
                height: effect.size,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1, 0.5, 0],
                opacity: [0, 0.6, 0.3, 0]
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div 
                className="w-full h-full rounded-full border-2"
                style={{
                  borderColor: effect.color,
                  background: `radial-gradient(circle, ${effect.color}20, transparent)`,
                  boxShadow: `0 0 ${effect.size / 2}px ${effect.size / 2}px ${effect.color}40`,
                }}
              />
            </motion.div>
          );
        }
        
        if (effect.type === 'glow') {
          return (
            <motion.div
              key={effect.id}
              className="absolute pointer-events-none"
              style={{
                left: effect.x - effect.size / 2,
                top: effect.y - effect.size / 2,
                width: effect.size,
                height: effect.size,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 1.5, 1, 0],
                opacity: [0, 0.8, 0.4, 0]
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div 
                className="w-full h-full rounded-full blur-md"
                style={{
                  background: `radial-gradient(circle, ${effect.color}40, ${effect.color}10, transparent)`,
                  boxShadow: `0 0 ${effect.size}px ${effect.size}px ${effect.color}30`,
                }}
              />
            </motion.div>
          );
        }
        
        if (effect.type === 'star') {
          const starPoints = 5;
          const innerRadius = effect.size * 0.3;
          const outerRadius = effect.size * 0.6;
          
          return (
            <motion.div
              key={effect.id}
              className="absolute pointer-events-none"
              style={{
                left: effect.x - effect.size / 2,
                top: effect.y - effect.size / 2,
                width: effect.size,
                height: effect.size,
                transform: `rotate(${effect.angle}deg)`,
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.2, 1, 0],
                opacity: [0, 1, 0.5, 0],
                rotate: [0, 360, 720, 0]
              }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke={effect.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {[...Array(starPoints)].map((_, i) => {
                  const angle = (i * 360) / starPoints - 90;
                  const x = 12 + outerRadius * Math.cos(angle * Math.PI / 180);
                  const y = 12 + outerRadius * Math.sin(angle * Math.PI / 180);
                  const x2 = 12 + innerRadius * Math.cos(angle * Math.PI / 180);
                  const y2 = 12 + innerRadius * Math.sin(angle * Math.PI / 180);
                  return <line key={i} x1={x} y1={y} x2={x2} y2={y2} />;
                })}
              </svg>
            </motion.div>
          );
        }
        
        if (effect.type === 'orbit') {
          const orbitX = effect.x + Math.cos((effect.angle || 0) * Math.PI / 180) * (effect.distance || 0);
          const orbitY = effect.y + Math.sin((effect.angle || 0) * Math.PI / 180) * (effect.distance || 0);
          
          return (
            <motion.div
              key={effect.id}
              className="absolute pointer-events-none"
              style={{
                left: orbitX - effect.size / 2,
                top: orbitY - effect.size / 2,
                width: effect.size,
                height: effect.size,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8, 0],
                opacity: [0, 0.7, 0.3, 0]
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div 
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${effect.color}30, transparent)`,
                  border: `1px solid ${effect.color}50`,
                }}
              />
            </motion.div>
          );
        }
        
        return null;
      })}

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
                className="flex items-center justify-center lg:justify-start gap-4 mb-8"
              >
                <div className="relative">
                  <Shield className="h-14 w-14 text-green-400" />
                  <motion.div
                    className="absolute inset-0 blur-sm opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="h-14 w-14 text-green-400" />
                  </motion.div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      SentinelX
                    </span>
                  </h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl"
                  >
                    Enterprise cybersecurity platform providing real-time threat detection,
                    automated response, and comprehensive security monitoring.
                  </motion.p>
                </div>
              </motion.div>
              
              {/* CTA Buttons */}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300" />
                </motion.a>

                <motion.a
                  href="#platform"
                  className={cn(
                    "group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-semibold text-lg rounded-xl transition-all duration-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600",
                    "transform hover:scale-105 active:scale-95"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Platform
                  <Globe className="ml-2 h-5 w-5 transition-transform duration-300" />
                </motion.a>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {[
                  { icon: Activity, title: "Real-time Detection", desc: "Advanced threat detection algorithms" },
                  { icon: Shield, title: "Automated Response", desc: "SOAR playbooks for instant mitigation" },
                  { icon: Zap, title: "AI-Powered", desc: "Machine learning for enhanced accuracy" }
                ].map((feature, index) => (
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
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Enhanced Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
                <h3 className="text-white font-bold text-xl mb-6 text-center">
                  Interactive Security Dashboard
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Shield, title: "Real-time Monitoring", desc: "Live security threat tracking", color: "#10b981" },
                    { icon: Activity, title: "Alert System", desc: "Instant threat notifications", color: "#3b82f6" },
                    { icon: Zap, title: "Analytics Dashboard", desc: "Advanced security metrics", color: "#06b6d4" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30"
                    >
                      <div className="flex-shrink-0">
                        <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
