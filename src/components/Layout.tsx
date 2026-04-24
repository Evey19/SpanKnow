import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Library,
  Plus,
  Search,
  BookOpen,
  Settings,
  Sparkles,
  Bot,
} from "lucide-react";
import { AIChatDrawer } from "./AIChatDrawer";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-200">SnapKnow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`
            }
          >
            <Home size={20} />
            <span className="font-medium">首页</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`
            }
          >
            <Library size={20} />
            <span className="font-medium">知识库</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`
            }
          >
            <Plus size={20} />
            <span className="font-medium">添加内容</span>
          </NavLink>
          <NavLink
            to="/review"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`
            }
          >
            <BookOpen size={20} />
            <span className="font-medium">复习</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`
            }
          >
            <Search size={20} />
            <span className="font-medium">搜索</span>
          </NavLink>
          <button
            onClick={() => setIsChatOpen(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isChatOpen
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Bot size={20} />
            <span className="font-medium">AI 助手</span>
          </button>
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`
            }
          >
            <Settings size={20} />
            <span className="font-medium">设置</span>
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>
      
      {/* Floating AI Assistant Button for Mobile */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95"
      >
        <Bot size={28} />
      </button>

      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              }`
            }
          >
            <Home size={24} />
            <span className="text-xs mt-1">首页</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              }`
            }
          >
            <Library size={24} />
            <span className="text-xs mt-1">知识库</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-14 -mt-6 rounded-full shadow-lg transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-600 text-white"
              }`
            }
          >
            <Plus size={28} />
          </NavLink>
          <NavLink
            to="/review"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              }`
            }
          >
            <BookOpen size={24} />
            <span className="text-xs mt-1">复习</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              }`
            }
          >
            <Search size={24} />
            <span className="text-xs mt-1">搜索</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
