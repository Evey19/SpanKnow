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
  Plus,
} from "lucide-react";
import { AIChatDrawer } from "./AIChatDrawer";
import logo from "@/assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  type LocalUser = { avatar?: string | null; phone?: string | null };
  let user: LocalUser | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr) as LocalUser;
    } catch {
      user = null;
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* 1. 顶部导航栏 (Top Navigation Bar) */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={logo}
                  alt="SnapKnow Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-[19px] font-extrabold text-foreground tracking-tight">
                Snap<span className="text-primary">Know</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-4">
              {[
                { to: "/", label: "首页", icon: Home },
                { to: "/library", label: "知识库", icon: Library },
                { to: "/review", label: "复习", icon: BookOpen },
                { to: "/collections", label: "收藏集", icon: Search },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <item.icon
                    size={18}
                    strokeWidth={2.5}
                    className="opacity-70"
                  />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/add"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full shadow-md active:scale-95 transition-all"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>新建内容</span>
            </Link>

            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-colors relative"
            >
              <Bot size={20} strokeWidth={2.5} />
            </button>

            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative">
              <Bell size={20} strokeWidth={2.5} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </button>

            <Link
              to="/settings"
              className="p-1 hover:opacity-80 transition-opacity ml-1"
            >
              <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-primary overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
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
      <footer className="hidden lg:block w-full border-t border-border/60 bg-background/50 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center overflow-hidden shrink-0 grayscale opacity-80">
              <img
                src={logo}
                alt="SnapKnow Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-muted-foreground tracking-tight">
              SnapKnow © 2026
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">
              基础版权
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              用户协议
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              客服反馈
            </a>
            <span className="px-2 py-0.5 bg-muted rounded-md text-[11px] uppercase tracking-wider">
              v1.0.0
            </span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Button for Mobile */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95"
      >
        <Bot size={24} strokeWidth={2.5} />
      </button>

      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/60 z-50 pb-[env(safe-area-inset-bottom)]">
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
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    strokeWidth={2.5}
                    className={isActive ? "mb-1" : "mb-1 opacity-70"}
                  />
                  <span className="text-[10px] font-semibold">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-14 -mt-5 rounded-full shadow-lg transition-transform active:scale-95 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary text-primary-foreground"
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
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    strokeWidth={2.5}
                    className={isActive ? "mb-1" : "mb-1 opacity-70"}
                  />
                  <span className="text-[10px] font-semibold">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
