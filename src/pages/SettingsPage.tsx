import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Globe,
  Trash2,
  ChevronRight,
  Type,
  Scaling,
  Camera,
  Loader2,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { usePreferences } from "../contexts/PreferencesContext";
import { useAvatarMutation, useUpdateProfileMutation, useLogoutMutation } from "@/features/auth/useAuthMutation";
import { useCurrentUserQuery } from "@/features/auth/usePreferencesQueries";
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useAvatarMutation();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfileMutation();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const { data: remoteUser } = useCurrentUserQuery();
  const serverProfile = remoteUser;

  // We still fallback to local storage if remote data is missing or loading
  const userStr = localStorage.getItem("user");
  let localUser: any = null;
  if (userStr) {
    try {
      localUser = JSON.parse(userStr);
    } catch {}
  }
  
  const user = serverProfile || localUser;

  const [localAvatar, setLocalAvatar] = useState<string | null>(
    user?.avatar || user?.avatar_url || null,
  );
  const [username, setUsername] = useState<string>(user?.username || "");

  useEffect(() => {
    if (serverProfile) {
      setUsername(serverProfile.username || "");
      if (serverProfile.avatar_url) {
        setLocalAvatar(serverProfile.avatar_url);
      }
    }
  }, [serverProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadAvatar(file, {
      onSuccess: () => {
        const updatedUserStr = localStorage.getItem("user");
        if (updatedUserStr) {
          try {
            setLocalAvatar(JSON.parse(updatedUserStr).avatar);
          } catch {}
        }
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = () => {
    const next = username.trim();
    if (!next) return;
    updateProfile(
      { username: next },
      {
        onSuccess: (profile) => {
          setUsername(profile.username || next);
          if (profile.avatar_url) {
            setLocalAvatar(profile.avatar_url);
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <header className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <ArrowLeft
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            设置
          </h1>
        </header>

        <section>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 shadow-sm mb-8">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),transparent_60%)]" />
            <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_60%)]" />

            <div className="relative p-6 md:p-7 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center md:items-start gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500/40 via-indigo-400/20 to-emerald-400/30 blur opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white/90 dark:border-slate-950 shadow-lg flex items-center justify-center overflow-hidden">
                    {localAvatar ? (
                      <img
                        src={localAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-slate-400 dark:text-slate-600 tracking-tight">
                        {user?.phone ? user.phone.slice(-4) : "U"}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      {isUploadingAvatar ? (
                        <Loader2 size={22} className="animate-spin" />
                      ) : (
                        <Camera size={22} />
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar}
                  />
                </div>

                <div className="text-center md:text-left">
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {username?.trim() || "未设置用户名"}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {user?.phone ? `+86 ${user.phone}` : "未登录用户"}
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full md:w-auto">
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/30 p-4 md:p-5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                    个人资料
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="设置用户名"
                      className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-shadow"
                      disabled={isUpdatingProfile}
                    />
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isUpdatingProfile || !username.trim()}
                      className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                    >
                      {isUpdatingProfile && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      保存
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    点击头像可更换；用户名用于在复习与成就中展示。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">
            外观
          </h2>
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
                <span className="text-slate-700 dark:text-slate-300">
                  深色模式
                </span>
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
                <span className="text-slate-700 dark:text-slate-300">
                  全局字体
                </span>
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
                <span className="text-slate-700 dark:text-slate-300">
                  字体大小
                </span>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-transparent text-slate-500 dark:text-slate-400 text-sm font-medium outline-none cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <option value="small" className="dark:bg-slate-800">
                  小
                </option>
                <option value="medium" className="dark:bg-slate-800">
                  中 (默认)
                </option>
                <option value="large" className="dark:bg-slate-800">
                  大
                </option>
                <option value="xlarge" className="dark:bg-slate-800">
                  特大
                </option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">
            通知
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => {
                if (
                  !notifications &&
                  "Notification" in window &&
                  Notification.permission === "denied"
                ) {
                  alert(
                    "您的浏览器已屏蔽本站的通知权限，请在浏览器设置中手动开启。",
                  );
                  return;
                }
                setNotifications(!notifications);
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell
                  size={20}
                  className="text-slate-400 dark:text-slate-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  复习提醒 (浏览器推送)
                </span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  notifications
                    ? "bg-indigo-600"
                    : "bg-slate-200 dark:bg-slate-700"
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
                <Globe
                  size={20}
                  className="text-slate-400 dark:text-slate-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  数据同步
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 dark:text-slate-500"
              />
            </button>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                {isLoggingOut ? (
                  <Loader2 size={20} className="text-red-500 dark:text-red-400 animate-spin" />
                ) : (
                  <Trash2 size={20} className="text-red-500 dark:text-red-400" />
                )}
                <span className="text-red-600 dark:text-red-400">
                  {isLoggingOut ? "正在退出..." : "退出登录"}
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 dark:text-slate-500"
              />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">
            关于
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">版本</span>
              <span className="text-slate-400 dark:text-slate-500">v1.0.0</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">反馈</span>
              <ChevronRight
                size={20}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
