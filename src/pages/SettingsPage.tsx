import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Globe,
  Trash2,
  ChevronRight,
  Type,
  Scaling,
  Camera,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { usePreferences } from "../contexts/PreferencesContext";
import { useAvatarMutation, useUpdateProfileMutation, useLogoutMutation } from "@/features/auth/useAuthMutation";
import { FONTS } from "../lib/fonts";

export function SettingsPage() {
  const {
    uiTheme,
    setUiTheme,
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

  const userStr = localStorage.getItem("user");
  type LocalUser = { avatar?: string | null; avatar_url?: string | null; username?: string | null; phone?: string | null };
  let localUser: LocalUser | null = null;
  if (userStr) {
    try {
      localUser = JSON.parse(userStr) as LocalUser;
    } catch {
      localUser = null;
    }
  }

  const user = localUser;
  
  const [localAvatar, setLocalAvatar] = useState<string | null>(
    localUser?.avatar || localUser?.avatar_url || null,
  );
  const [username, setUsername] = useState<string>(localUser?.username || "");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadAvatar(file, {
      onSuccess: () => {
        const updatedUserStr = localStorage.getItem("user");
        if (updatedUserStr) {
          try {
            const updatedUser = JSON.parse(updatedUserStr) as LocalUser;
            setLocalAvatar(updatedUser.avatar || updatedUser.avatar_url || null);
          } catch {
            setLocalAvatar(null);
          }
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
            className="p-2 -ml-2 hover:bg-muted rounded-lg"
          >
            <ArrowLeft
              size={20}
              className="text-muted-foreground"
            />
          </Link>
          <h1 className="text-xl font-bold text-foreground">
            设置
          </h1>
        </header>

        <section>
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm mb-8">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,var(--chart-1),transparent_60%)] opacity-25" />
            <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,var(--chart-3),transparent_60%)] opacity-15" />

            <div className="relative p-6 md:p-7 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center md:items-start gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[var(--chart-1)] via-[var(--chart-4)] to-[var(--chart-3)] blur opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="relative w-24 h-24 rounded-full bg-muted border-4 border-background/80 shadow-lg flex items-center justify-center overflow-hidden">
                    {localAvatar ? (
                      <img
                        src={localAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-muted-foreground tracking-tight">
                        {user?.phone ? user.phone.slice(-4) : "U"}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-overlay/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-overlay-foreground">
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
                  <div className="text-xl font-extrabold text-foreground tracking-tight">
                    {username?.trim() || "未设置用户名"}
                  </div>
                  <div className="mt-1 text-sm font-medium text-muted-foreground">
                    {user?.phone ? `+86 ${user.phone}` : "未登录用户"}
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full md:w-auto">
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 md:p-5">
                  <div className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    个人资料
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="设置用户名"
                      className="flex-1 h-11 px-4 rounded-xl border border-input bg-background/80 text-foreground text-sm font-semibold outline-none focus:border-ring focus:ring-4 focus:ring-ring/20 transition-shadow"
                      disabled={isUpdatingProfile}
                    />
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isUpdatingProfile || !username.trim()}
                      className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                    >
                      {isUpdatingProfile && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      保存
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    点击头像可更换；用户名用于在复习与成就中展示。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            外观
          </h2>
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-primary" />
                <span className="text-foreground">
                  主题风格
                </span>
              </div>
              <select
                value={uiTheme}
                onChange={(e) => setUiTheme(e.target.value)}
                className="bg-transparent text-muted-foreground text-sm font-medium outline-none cursor-pointer hover:text-foreground transition-colors"
              >
                <option value="paper" className="bg-popover">
                  纸墨
                </option>
                <option value="sage" className="bg-popover">
                  护眼
                </option>
                <option value="aurora" className="bg-popover">
                  极光
                </option>
              </select>
            </div>
            <div className="border-t border-border" />
            <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Type size={20} className="text-primary" />
                <span className="text-foreground">
                  全局字体
                </span>
              </div>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="bg-transparent text-muted-foreground text-sm font-medium outline-none cursor-pointer hover:text-foreground transition-colors"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id} className="bg-popover">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-t border-border" />
            <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Scaling size={20} className="text-primary" />
                <span className="text-foreground">
                  字体大小
                </span>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-transparent text-muted-foreground text-sm font-medium outline-none cursor-pointer hover:text-foreground transition-colors"
              >
                <option value="small" className="bg-popover">
                  小
                </option>
                <option value="medium" className="bg-popover">
                  中 (默认)
                </option>
                <option value="large" className="bg-popover">
                  大
                </option>
                <option value="xlarge" className="bg-popover">
                  特大
                </option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            通知
          </h2>
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
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
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell
                  size={20}
                  className="text-muted-foreground"
                />
                <span className="text-foreground">
                  复习提醒 (浏览器推送)
                </span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  notifications
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-background rounded-full shadow transform transition-transform mt-0.5 ${
                    notifications ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            数据管理
          </h2>
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Globe
                  size={20}
                  className="text-muted-foreground"
                />
                <span className="text-foreground">
                  数据同步
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-muted-foreground"
              />
            </button>
            <div className="border-t border-border" />
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                {isLoggingOut ? (
                  <Loader2 size={20} className="text-destructive animate-spin" />
                ) : (
                  <Trash2 size={20} className="text-destructive" />
                )}
                <span className="text-destructive">
                  {isLoggingOut ? "正在退出..." : "退出登录"}
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-muted-foreground"
              />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            关于
          </h2>
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-foreground">版本</span>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>
            <div className="border-t border-border" />
            <div className="px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer">
              <span className="text-foreground">反馈</span>
              <ChevronRight
                size={20}
                className="text-muted-foreground"
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
