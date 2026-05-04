"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Shield, Activity, Lock, Zap, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { name: 'Features', href: '#features', icon: Activity },
  { name: 'Platform', href: '#platform', icon: Shield },
  { name: 'Security', href: '#security', icon: Lock },
  { name: 'Pricing', href: '#pricing', icon: Zap },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 10);
    });
  }, [scrollY]);

  // Calculate dynamic values based on scroll natively in framer-motion without re-renders
  const navbarHeight = useTransform(scrollY, [0, 100], ["64px", "56px"]);
  const paddingX = useTransform(scrollY, [0, 100], ["64px", "32px"]); // 16 * 4px to 8 * 4px
  const paddingY = useTransform(scrollY, [0, 100], ["16px", "8px"]);
  const logoSize = useTransform(scrollY, [0, 100], ["32px", "24px"]);
  const fontSize = useTransform(scrollY, [0, 100], ["20px", "16px"]);
  const iconSize = useTransform(scrollY, [0, 100], ["16px", "14px"]);
  const fontSizeSmall = useTransform(scrollY, [0, 100], ["18px", "14px"]);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ height: navbarHeight }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-out flex items-center",
          isScrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-green-500/30 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <motion.div 
          className="w-full max-w-7xl mx-auto"
          style={{ 
            paddingLeft: paddingX,
            paddingRight: paddingX,
            paddingTop: paddingY,
            paddingBottom: paddingY
          }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2 group transition-all duration-300 ease-out"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <motion.div style={{ width: logoSize, height: logoSize }}>
                  <Shield className="w-full h-full text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 blur-sm opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ width: logoSize, height: logoSize }}
                >
                  <Shield className="w-full h-full text-green-400" />
                </motion.div>
              </div>
              <motion.span 
                className="font-bold text-white group-hover:text-green-400 transition-colors duration-300"
                style={{ fontSize: fontSize }}
              >
                SentinelX
              </motion.span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-colors duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <motion.div style={{ width: iconSize, height: iconSize }}>
                      <Icon className="w-full h-full" />
                    </motion.div>
                    <motion.span 
                      className="font-medium"
                      style={{ fontSize: fontSizeSmall }}
                    >
                      {item.name}
                    </motion.span>
                  </motion.a>
                );
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <motion.a
                    href="/login"
                    className="flex items-center text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors duration-300 px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    style={{ fontSize: fontSizeSmall }}
                  >
                    <motion.div style={{ width: iconSize, height: iconSize }} className="mr-2">
                      <LogIn className="w-full h-full" />
                    </motion.div>
                    Login
                  </motion.a>
                  <motion.a
                    href="/signup"
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-400 text-black font-semibold rounded-lg hover:from-green-400 hover:to-green-500 transition-colors duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    style={{ fontSize: fontSizeSmall }}
                  >
                    <motion.div style={{ width: iconSize, height: iconSize }} className="mr-2">
                      <UserPlus className="w-full h-full" />
                    </motion.div>
                    Sign Up
                  </motion.a>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg"
                    style={{ fontSize: fontSizeSmall }}
                  >
                    <motion.div 
                      className="rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xs"
                      style={{ 
                        width: useTransform(iconSize, size => `calc(${size} + 2px)`), 
                        height: useTransform(iconSize, size => `calc(${size} + 2px)`) 
                      }}
                    >
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                    </motion.div>
                    <span className="text-white">{user?.email || 'admin@sentinelx.com'}</span>
                  </motion.div>
                  <motion.button
                    onClick={logout}
                    className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    style={{ fontSize: fontSizeSmall }}
                  >
                    Logout
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-50 md:hidden pointer-events-none"
      >
        {/* Backdrop */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute right-0 top-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-green-500/20 pointer-events-auto"
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-green-500/20">
              <span className="text-white font-semibold">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex-1 p-4">
              <div className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="p-4 border-t border-green-500/20">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <motion.a
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-slate-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <LogIn className="h-4 w-4 mr-2 inline" />
                    Login
                  </motion.a>
                  <motion.a
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-gradient-to-r from-green-500 to-green-400 text-black font-semibold rounded-lg hover:from-green-400 hover:to-green-500 transition-colors shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserPlus className="h-4 w-4 mr-2 inline" />
                    Sign Up
                  </motion.a>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="px-4 py-2 text-slate-300 text-sm">
                    Welcome, {user?.name}
                  </div>
                  <motion.button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 text-center text-slate-300 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Logout
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
