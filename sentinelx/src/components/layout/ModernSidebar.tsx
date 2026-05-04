"use client";

import { useState, memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/use-auth";
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
  ChevronRight,
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

const NavItem = memo(({ item, pathname, isExpanded, isDarkMode }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const active = pathname.startsWith(item.href);

  return (
    <div className="relative">
      {!isExpanded && (
        <div className={cn(
          "absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-card text-foreground text-xs rounded pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-border shadow-md",
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
          "transition-all duration-300 ease-in-out",
          isExpanded ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
          active
            ? (isDarkMode ? "bg-accent text-accent-foreground shadow-sm" : "bg-green-50 text-green-600 border border-green-200/50")
            : (isDarkMode ? "text-muted-foreground hover:text-foreground hover:bg-accent/40" : "text-gray-700 hover:bg-gray-100")
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ willChange: "transform, background-color" }}
      >
        <div className="relative flex-shrink-0">
          <item.icon className={cn(
            "transition-transform duration-300",
            isExpanded ? "h-5 w-5" : "h-4.5 w-4.5",
            (active || isHovered) && (isDarkMode ? "text-white" : "text-green-700"),
          )} />

          {item.badge > 0 && (
            <span className={cn(
              "absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white shadow-sm",
              active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-200"
            )}>
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-medium overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {isHovered && isExpanded && (
          <ChevronRight className="h-4 w-4 ml-auto opacity-40" />
        )}
      </Link>
    </div>
  );
});

NavItem.displayName = 'NavItem';

export function ModernSidebar() {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverIntent, setHoverIntent] = useState<NodeJS.Timeout | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleMouseEnter = () => {
    if (isPinned) return;
    if (hoverIntent) clearTimeout(hoverIntent);
    const timeout = setTimeout(() => setIsExpanded(true), 80);
    setHoverIntent(timeout);
  };

  const handleMouseLeave = () => {
    if (isPinned) return;
    if (hoverIntent) clearTimeout(hoverIntent);
    const timeout = setTimeout(() => setIsExpanded(false), 120);
    setHoverIntent(timeout);
  };

  const handleLogout = () => {
    localStorage.clear();
    const { logout } = useAuth.getState();
    logout();
    window.location.href = '/';
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (isPinned) setIsExpanded(false);
    window.dispatchEvent(new CustomEvent('sidebarExpanded', { detail: { expanded: !isPinned } }));
  };

  return (
    <>
      {/* Layout Placeholder - Prevents reflow lag by only jumping when pinned, never during hover */}
      <div 
        className={cn(
          "shrink-0 h-screen transition-none",
          isPinned ? "w-[240px]" : "w-[72px]"
        )}
      />

      {/* Visual Sidebar - Floats above content when hovering */}
      <aside
        className={cn(
          "absolute top-0 left-0 h-screen border-r backdrop-blur-xl z-50 transition-all duration-300 ease-out overflow-hidden shadow-2xl shadow-black/10",
          isDarkMode ? "bg-sidebar/90 border-white/5" : "bg-white/90 border-black/5",
          isExpanded || isPinned ? "w-[240px]" : "w-[72px]"
        )}
        style={{ willChange: "width" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="relative h-full flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 pt-6 overflow-x-hidden overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              pathname={pathname} 
              isExpanded={isExpanded || isPinned} 
              isDarkMode={isDarkMode} 
            />
          ))}
        </nav>

        {/* Bottom actions */}
        <div className={cn("p-3 border-t space-y-2", isDarkMode ? "border-white/5" : "border-black/5")}>
          {/* Theme Toggle */}
          <button
            onClick={() => toggleTheme()}
            className={cn(
              "group relative w-full flex items-center rounded-lg overflow-hidden",
              "transition-all duration-200",
              isExpanded || isPinned ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
              "text-muted-foreground hover:text-foreground hover:bg-accent/40"
            )}
          >
            <motion.div animate={{ rotate: isDarkMode ? 360 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
            <AnimatePresence>
              {(isExpanded || isPinned) && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="font-medium"
                >
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Pin */}
          <button
            onClick={togglePin}
            className={cn(
              "group relative w-full flex items-center rounded-lg overflow-hidden transition-all duration-200",
              isExpanded || isPinned ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
              isPinned ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
            )}
          >
            <Menu className={cn("h-5 w-5 transition-transform", isPinned && "rotate-90")} />
            <AnimatePresence>
              {(isExpanded || isPinned) && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                  {isPinned ? "Unpin" : "Pin Sidebar"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              "group relative w-full flex items-center rounded-lg overflow-hidden transition-all duration-200",
              isExpanded || isPinned ? "gap-3 px-3 py-2.5 justify-start" : "justify-center px-2 py-2.5",
              "text-destructive hover:bg-destructive/10"
            )}
          >
            <LogOut className="h-5 w-5" />
            <AnimatePresence>
              {(isExpanded || isPinned) && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
