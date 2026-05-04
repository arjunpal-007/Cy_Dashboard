"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Users,
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ================= TYPES ================= */
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface ModernNavbarProps {
  currentPath?: string;
  className?: string;
}

/* ================= MENU ITEMS ================= */
const menuItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    name: "Threats",
    href: "/threats",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    name: "Users",
    href: "/users",
    icon: <Users className="w-4 h-4" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

/* ================= MAIN COMPONENT ================= */
export function ModernNavbar({ currentPath = "/dashboard", className }: ModernNavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-mobile-menu]")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isDarkMode
          ? isScrolled
            ? "bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50"
            : "bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/30"
          : isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/50"
            : "bg-white/80 backdrop-blur-lg border-b border-gray-100/30",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={cn(
                "text-xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                SentinelX
              </h1>
              <p className={cn(
                "text-xs",
                isDarkMode ? "text-slate-400" : "text-gray-600"
              )}>
                Security Operations
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <a
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out group",
                    "hover:scale-110 hover:shadow-lg",
                    isActive(item.href)
                      ? isDarkMode
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      : isDarkMode
                        ? "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>

                  {/* Hover underline/glow effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
                    isActive(item.href) ? "opacity-100" : "opacity-0"
                  )} />

                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                        isDarkMode ? "bg-blue-400" : "bg-blue-600"
                      )}
                      initial={false}
                      animate={true}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "p-2.5 rounded-lg transition-all duration-300 ease-in-out",
                "hover:scale-110 hover:shadow-lg",
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                key={isDarkMode ? "moon" : "sun"}
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={cn(
                  "relative transition-transform duration-[300ms]",
                  isDarkMode ? "text-yellow-300" : "text-blue-500"
                )}
              >
                {isDarkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}

                {/* Glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full opacity-0 transition-opacity duration-[300ms]",
                  isDarkMode ? "bg-yellow-400/20" : "bg-blue-500/20"
                )} />
              </motion.div>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2.5 rounded-lg transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] group",
                "hover:scale-[1.05] hover:shadow-2xl hover:-translate-y-[-1px]",
                "before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity before:duration-[300ms] before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:before:opacity-100",
                "after:absolute after:inset-0 after:rounded-lg after:opacity-0 after:transition-opacity after:duration-[300ms] after:content-[''] after:bg-gradient-to-r after:from-transparent after:via-black/10 after:to-transparent hover:after:opacity-100",
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-blue-400/50 shadow-lg"
                  : "windows-accent hover:windows-hover border-windows-border shadow-lg"
              )}
              data-mobile-menu
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                key={isMobileMenuOpen ? "close" : "open"}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "md:hidden overflow-hidden",
                isDarkMode
                  ? "bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50"
                  : "bg-white/95 backdrop-blur-xl border-b border-gray-200/50"
              )}
              data-mobile-menu
            >
              <div className="px-4 py-6 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                      "hover:scale-[1.05] hover:shadow-md",
                      isActive(item.href)
                        ? (isDarkMode
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                          : "windows-bg text-white border-windows-border")
                        : (isDarkMode
                          ? "text-slate-300 hover:text-white hover:bg-slate-800/50"
                          : "windows-text hover:bg-gray-100")
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

/* ================= EXPORTS ================= */
export default ModernNavbar;
