import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  LayoutDashboard,
  SmilePlus,
  BookOpen,
  Users,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Mood Tracker", icon: SmilePlus, page: "MoodTracker" },
  { name: "Journal", icon: BookOpen, page: "Journal" },
  { name: "Community", icon: Users, page: "Community" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        :root {
          --color-primary: #7C9A92;
          --color-primary-light: #A8C5BC;
          --color-accent: #B8A9C9;
          --color-warm: #E8C4A2;
          --color-bg: #FAF8F5;
          --color-text: #2D2D2D;
          --color-text-muted: #8A8A8A;
        }
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 3px; }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white/70 backdrop-blur-xl border-r border-stone-200/60 z-40">
        <div className="p-6 pb-2">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C9A92] to-[#A8C5BC] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#2D2D2D] tracking-tight">Serenity</h1>
              <p className="text-[10px] text-[#8A8A8A] uppercase tracking-widest">Mental Wellness</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#7C9A92]/10 text-[#7C9A92]"
                    : "text-[#8A8A8A] hover:text-[#2D2D2D] hover:bg-stone-100/60"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-[#7C9A92]" : ""
                }`} />
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C9A92]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-[#B8A9C9]/20 to-[#E8C4A2]/20 border border-[#B8A9C9]/20">
          <p className="text-xs text-[#8A8A8A] leading-relaxed">
            "You are enough just as you are."
          </p>
          <p className="text-[10px] text-[#B8A9C9] mt-2 font-medium">— Daily Reminder</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-stone-200/60 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C9A92] to-[#A8C5BC] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-[#2D2D2D]">Serenity</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 pt-20 space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#7C9A92]/10 text-[#7C9A92]"
                        : "text-[#8A8A8A] hover:text-[#2D2D2D] hover:bg-stone-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}