import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Globe,
  Trash2,
  ChevronRight,
  Type,
  Scaling
} from "lucide-react";
import { Layout } from "../components/Layout";
import { usePreferences } from "../contexts/PreferencesContext";
import { FONTS } from "../lib/fonts";

export function SettingsPage() {
  const {
    darkMode,
    setDarkMode,
    notifications,
    setNotifications,
    font,
    setFont,
    fontSize,
    setFontSize,
  } = usePreferences();

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <header className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">设置</h1>
        </header>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">外观</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon size={20} className="text-indigo-400" />
                ) : (
                  <Sun size={20} className="text-amber-500" />
                )}
                <span className="text-slate-700 dark:text-slate-300">深色模式</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  darkMode ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                    darkMode ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Type size={20} className="text-blue-500" />
                <span className="text-slate-700 dark:text-slate-300">全局字体</span>
              </div>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="bg-transparent text-slate-500 dark:text-slate-400 text-sm font-medium outline-none cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id} className="dark:bg-slate-800">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Scaling size={20} className="text-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300">字体大小</span>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-transparent text-slate-500 dark:text-slate-400 text-sm font-medium outline-none cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <option value="small" className="dark:bg-slate-800">小</option>
                <option value="medium" className="dark:bg-slate-800">中 (默认)</option>
                <option value="large" className="dark:bg-slate-800">大</option>
                <option value="xlarge" className="dark:bg-slate-800">特大</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">通知</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => {
                if (!notifications && "Notification" in window && Notification.permission === "denied") {
                  alert("您的浏览器已屏蔽本站的通知权限，请在浏览器设置中手动开启。");
                  return;
                }
                setNotifications(!notifications);
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-slate-400 dark:text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">复习提醒 (浏览器推送)</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  notifications ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                    notifications ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">
            数据管理
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-slate-400 dark:text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">数据同步</span>
              </div>
              <ChevronRight size={20} className="text-slate-400 dark:text-slate-500" />
            </button>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-red-500 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400">清除所有数据</span>
              </div>
              <ChevronRight size={20} className="text-slate-400 dark:text-slate-500" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">关于</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">版本</span>
              <span className="text-slate-400 dark:text-slate-500">v1.0.0</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">反馈</span>
              <ChevronRight size={20} className="text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
