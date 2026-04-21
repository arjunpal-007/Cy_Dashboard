"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Activity,
  Siren,
  FolderKanban,
  Radar,
  Settings,
  Workflow,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Bell,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "SOC Dashboard", icon: Shield, badge: 0 },
  { href: "/logs", label: "Log Explorer", icon: Activity, badge: 3 },
  { href: "/alerts", label: "Alerts", icon: Siren, badge: 12 },
  { href: "/incidents", label: "Incidents", icon: FolderKanban, badge: 5 },
  { href: "/intel", label: "Threat Intel", icon: Radar, badge: 0 },
  { href: "/soar", label: "SOAR", icon: Workflow, badge: 2 },
  { href: "/settings", label: "Admin Settings", icon: Settings, badge: 0 },
];

export function ModernSidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverIntent, setHoverIntent] = useState<NodeJS.Timeout | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle hover intent with delay
  const handleMouseEnter = () => {
    if (isPinned) return;

    // Clear existing timeout
    if (hoverIntent) clearTimeout(hoverIntent);

    // Set new timeout for hover intent
    const timeout = setTimeout(() => {
      setIsHovering(true);
      setIsExpanded(true);
    }, 100);

    setHoverIntent(timeout);
  };

  const handleMouseLeave = () => {
    if (isPinned) return;

    // Clear existing timeout
    if (hoverIntent) clearTimeout(hoverIntent);

    // Set new timeout for leave intent
    const timeout = setTimeout(() => {
      setIsHovering(false);
      setIsExpanded(false);
    }, 150);

    setHoverIntent(timeout);
  };

  // Toggle pin state
  // Handle logout
  const handleLogout = () => {
    try {
      // Clear auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Clear Zustand auth state
      const { useAuth } = require('@/hooks/use-auth');
      const { logout } = useAuth.getState();
      logout();

      // Force redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback - clear all data and redirect
      localStorage.clear();
      window.location.href = '/';
    }
  };

  // Toggle pin state
  const togglePin = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);

    // If unpinning and not hovering, collapse immediately
    if (!newPinnedState && !isHovering) {
      setIsExpanded(false);
    } else if (newPinnedState) {
      setIsExpanded(true);
    }

    // Emit event for layout to adjust spacing when pinning
    window.dispatchEvent(new CustomEvent('sidebarExpanded', { detail: { expanded: newPinnedState } }));
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          /* In-flow so the row reserves width; fixed was collapsing the flex sibling and overlapping main */
          "relative shrink-0 h-screen border-r backdrop-blur-md",
          "transition-[width] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          isDarkMode
            ? "bg-sidebar/40 border-white/5"
            : "bg-white/40 border-r border-black/10",
          isExpanded ? "w-[240px]" : "w-[70px]"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="relative h-full flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 pt-4">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const isHovered = hoveredItem === item.href;

              return (
                <div key={item.href} className="relative">
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className={cn(
                      "absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-card text-foreground text-xs rounded pointer-events-none opacity-0 transition-opacity duration-200 z-50 whitespace-nowrap border border-border",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}>
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card rotate-45 border-t border-r border-border" />
                    </div>
                  )}

                  <Link
                    href={item.href}
                    className={cn(
                      "group relative w-full flex items-center rounded-lg overflow-hidden",
                      "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                      "hover:scale-[1.04]",
                      isExpanded ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
                      pathname === item.href
                        ? (isDarkMode
                          ? "bg-accent text-accent-foreground border border-accent/50"
                          : "bg-green-50 text-green-600 border border-green-200")
                        : (isDarkMode
                          ? "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
                          : "text-gray-700 hover:bg-gray-100 border border-transparent")
                    )}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Hover glow effect */}
                    {isHovered && !active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg" />
                    )}

                    {/* Icon container */}
                    <div className="relative flex-shrink-0">
                      <item.icon className={cn(
                        "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isExpanded ? "h-5 w-5" : "h-4 w-4",
                        active || isHovered
                          ? isDarkMode
                            ? "text-white"
                            : "text-green-700"
                          : "text-inherit",
                      )} />

                      {/* Badge */}
                      {item.badge > 0 && (
                        <span className={cn(
                          "absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white",
                          pathname === item.href ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                          "transition-opacity duration-200"
                        )}>
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}

                      {/* Active indicator */}
                      {active && (
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-green-400 rounded-full" />
                      )}
                    </div>

                    {/* Text */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, translateX: -10 }}
                          animate={{ opacity: 1, translateX: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: 0.1,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          className={cn(
                            "font-medium overflow-hidden whitespace-nowrap",
                            active || isHovered
                              ? isDarkMode
                                ? "text-white"
                                : "text-green-800"
                              : "text-inherit",
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Hover arrow */}
                    {isHovered && isExpanded && (
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className={cn("p-2 border-t space-y-2", isDarkMode ? "border-white/5" : "border-black/10")}>
            {/* Theme Toggle */}
            <motion.button
              onClick={() => toggleTheme()}
              className={cn(
                "group relative w-full flex items-center rounded-lg overflow-hidden",
                "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "hover:scale-[1.02]",
                isExpanded ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
                "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: isDarkMode ? 360 : 0,
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                >
                  {isDarkMode ? (
                    <Moon className={cn(
                      "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isExpanded ? "h-5 w-5" : "h-4 w-4"
                    )} />
                  ) : (
                    <Sun className={cn(
                      "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isExpanded ? "h-5 w-5" : "h-4 w-4"
                    )} />
                  )}
                </motion.div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, translateX: -10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.1,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="font-medium overflow-hidden"
                  >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Pin button */}
            <motion.button
              onClick={togglePin}
              className={cn(
                "group relative w-full flex items-center rounded-lg overflow-hidden",
                "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "hover:scale-[1.02]",
                isExpanded ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
                isPinned
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: isPinned ? 45 : 0,
                    transition: { duration: 0.4, ease: "easeInOut" }
                  }}
                >
                  <Menu className={cn(
                    "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isExpanded ? "h-5 w-5" : "h-4 w-4"
                  )} />
                  {isPinned && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </motion.div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, translateX: -10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.1,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="font-medium overflow-hidden"
                  >
                    {isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Divider */}
            <div className={cn("border-t", isDarkMode ? "border-white/5" : "border-black/10")} />

            {/* Logout button */}
            <motion.button
              onClick={handleLogout}
              className={cn(
                "group relative w-full flex items-center rounded-lg overflow-hidden",
                "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "hover:scale-[1.02]",
                isExpanded ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
                "text-destructive hover:text-destructive hover:bg-destructive/10 border border-transparent"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{
                  rotate: isExpanded ? 180 : 0,
                  transition: { duration: 0.4, ease: "easeInOut" }
                }}
              >
                <LogOut className={cn(
                  "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isExpanded ? "h-5 w-5" : "h-4 w-4"
                )} />
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, translateX: -10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.1,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="font-medium overflow-hidden"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </aside>
    </>
  );
}
