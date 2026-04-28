import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Library,
  BookOpen,
  Bell,
  Search,
  Bot,
  User,
  Plus
} from "lucide-react";
import { AIChatDrawer } from "./AIChatDrawer";
import logo from "@/assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  let user: any = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] flex flex-col font-sans">
      {/* 1. 顶部导航栏 (Top Navigation Bar) */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden shrink-0">
                <img src={logo} alt="SnapKnow Logo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[19px] font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Snap<span className="text-indigo-600 dark:text-indigo-400">Know</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-4">
              {[
                { to: "/", label: "首页", icon: Home },
                { to: "/library", label: "题库", icon: Library },
                { to: "/review", label: "错题本", icon: BookOpen },
                { to: "/collections", label: "收藏集", icon: Search },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    }`
                  }
                >
                  <item.icon size={18} strokeWidth={2.5} className="opacity-70" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/add" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full shadow-md shadow-indigo-600/20 active:scale-95 transition-all">
              <Plus size={16} strokeWidth={2.5} />
              <span>新建内容</span>
            </Link>

            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors relative"
            >
              <Bot size={20} strokeWidth={2.5} />
            </button>

            <button className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell size={20} strokeWidth={2.5} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
            </button>

            <Link to="/settings" className="p-1 hover:opacity-80 transition-opacity ml-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} strokeWidth={2.5} />
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-12">
        {children}
      </main>

      {/* 6. 底部功能栏 (Footer) - Desktop Only */}
      <footer className="hidden lg:block w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden shrink-0 grayscale opacity-80">
              <img src={logo} alt="SnapKnow Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 tracking-tight">SnapKnow © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">基础版权</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">用户协议</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">客服反馈</a>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px] uppercase tracking-wider">v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Button for Mobile */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95"
      >
        <Bot size={24} strokeWidth={2.5} />
      </button>

      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16">
          {[
            { to: "/", label: "首页", icon: Home },
            { to: "/library", label: "题库", icon: Library },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={2.5} className={isActive ? "mb-1" : "mb-1 opacity-70"} />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-14 -mt-5 rounded-full shadow-lg transition-transform active:scale-95 ${
                isActive
                  ? "bg-indigo-600 shadow-indigo-600/30 text-white"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/20"
              }`
            }
          >
            <Plus size={26} strokeWidth={3} />
          </NavLink>

          {[
            { to: "/review", label: "错题本", icon: BookOpen },
            { to: "/settings", label: "我的", icon: User },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={2.5} className={isActive ? "mb-1" : "mb-1 opacity-70"} />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
