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
  color: string;
  size: number;
}

interface AntiGravityParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [antiGravityParticles, setAntiGravityParticles] = useState<AntiGravityParticle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Anti-gravity particle effect
      setAntiGravityParticles(prev => {
        const colors = ['#10b981', '#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];
        const newParticle: AntiGravityParticle = {
          id: Date.now() + Math.random(),
          x: newPosition.x,
          y: newPosition.y,
          vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
          vy: -Math.random() * 6 - 2, // Upward velocity (anti-gravity)
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 60 + Math.random() * 40, // 1-4 seconds lifetime
        };
        
        // Keep only last 20 particles
        const updated = [...prev, newParticle].slice(-20);
        return updated;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Background particles
    const generatedParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
      color: ['#10b981', '#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'][i % 5],
      size: 1 + Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, [isClient]);

  // Anti-gravity physics simulation
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setAntiGravityParticles(prev => 
        prev.map(particle => {
          let newVy = particle.vy + 0.3; // Gravity effect
          let newVx = particle.vx * 0.98; // Air resistance
          let newY = particle.y + newVy;
          const newX = particle.x + newVx;
          
          // Anti-gravity bounce effect
          if (newY > window.innerHeight - 50) {
            newVy = -Math.abs(newVy) * 0.7; // Bounce up
            newY = window.innerHeight - 50;
          }
          
          // Wall bouncing
          if (newX < 0 || newX > window.innerWidth) {
            newVx = -newVx * 0.8;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            life: particle.life + 1,
          };
        }).filter(particle => particle.life < particle.maxLife)
      );
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(60deg,transparent_24%,rgba(57,255,20,0.05)_25%,transparent_26%,transparent_74%,rgba(0,245,255,0.05)_75%,transparent_76%,transparent)] bg-[length:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(57,255,20,0.1)_50%,transparent_100%)]" />
        
        {/* Animated gradient overlay */}
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
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Background Floating Particles */}
      {isClient && (
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
              }}
              animate={{
                y: [0, -30, -15, 0],
                x: [0, 10, -5, 0],
                opacity: [0, 0.7, 0.3, 0],
                scale: [0, 1.2, 1, 1.2],
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

      {/* Anti-Gravity Mouse Trail */}
      {isClient && antiGravityParticles.map((particle) => {
        const opacity = Math.max(0, 1 - (particle.life / particle.maxLife));
        const scale = Math.max(0.2, 1 - (particle.life / particle.maxLife) * 0.5);
        
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {/* Glowing effect */}
            <div 
              className="absolute inset-0 rounded-full blur-sm"
              style={{
                background: `radial-gradient(circle, ${particle.color}40, transparent)`,
                boxShadow: `0 0 ${particle.size}px ${particle.size}px ${particle.color}20`,
              }}
            />
          </motion.div>
        );
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
              
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-300 mb-8"
              >
                Enterprise cybersecurity platform providing real-time threat detection,
                automated response, and comprehensive security monitoring.
              </motion.p>

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

          {/* Right Side - Anti-Gravity Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
                <h3 className="text-white font-bold text-xl mb-6 text-center">
                  Anti-Gravity System
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "Zero-Gravity Particles", desc: "Physics-defying particle effects", color: "#10b981" },
                    { title: "Levitation Mode", desc: "Anti-gravity simulation active", color: "#3b82f6" },
                    { title: "Quantum Effects", desc: "Advanced particle physics", color: "#06b6d4" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30"
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: feature.color }} />
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
