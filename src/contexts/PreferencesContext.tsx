import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { FONTS } from "../lib/fonts";
import { useUpdatePreferencesMutation } from "../features/auth/usePreferencesQueries";

interface PreferencesContextType {
  font: string;
  setFont: (fontId: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  uiTheme: string;
  setUiTheme: (theme: string) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- 本地状态初始化 ---
  const [font, setFont] = useState(() => {
    return localStorage.getItem("snapknow-font") || localStorage.getItem("snapknow-ui-font") || "system";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("snapknow-font-size") || "medium";
  });

  const [uiTheme, setUiTheme] = useState(() => {
    return localStorage.getItem("snapknow-ui-theme") || "paper";
  });

  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("snapknow-notifications") !== "false";
  });

  // 记录是否是初始加载或从远程拉取的同步，防止循环调用 PATCH 接口
  const isInitialSyncRef = useRef(true);

  const updatePreferencesMutation = useUpdatePreferencesMutation();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", uiTheme);
    localStorage.setItem("snapknow-ui-theme", uiTheme);

    const isDark = uiTheme === "aurora";
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const token = localStorage.getItem("access_token");
    if (token && !isInitialSyncRef.current) {
      updatePreferencesMutation.mutate({ dark_mode: isDark });
    }
  }, [uiTheme]);

  // --- 处理通知设置持久化与权限请求 ---
  useEffect(() => {
    localStorage.setItem("snapknow-notifications", String(notifications));

    // 同步到远端
    const token = localStorage.getItem("access_token");
    if (token && !isInitialSyncRef.current) {
      updatePreferencesMutation.mutate({ review_reminders: notifications });
    }

    // 处理浏览器推送通知权限
    if (notifications && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // TODO: 后续这里可以调用订阅 Service Worker Push Manager 的逻辑
            console.log("Push notification permission granted.");
          } else {
            // 用户拒绝了通知权限，可以考虑自动将开关关闭或给予提示
            console.log("Push notification permission denied.");
            setNotifications(false);
          }
        });
      } else if (Notification.permission === "denied") {
        // 如果之前已经被拒绝，可能需要提示用户去浏览器设置里手动开启
        console.log("Push notification is denied in browser settings.");
        // 在这里我们可以选择把开关关掉，以保持 UI 和实际状态一致
        // setNotifications(false); 
      }
    }
  }, [notifications]);

  // --- 处理字体大小变化及远程同步 ---
  useEffect(() => {
    const root = document.documentElement;
    let sizeValue = "16px"; // medium 默认
    
    switch (fontSize) {
      case "small":
        sizeValue = "14px";
        break;
      case "medium":
        sizeValue = "16px";
        break;
      case "large":
        sizeValue = "18px";
        break;
      case "xlarge":
        sizeValue = "20px";
        break;
    }
    
    root.style.fontSize = sizeValue;
    localStorage.setItem("snapknow-font-size", fontSize);

    // 如果用户已登录，且不是初次/远程同步带来的变更，则向后端发送 PATCH
    const token = localStorage.getItem("access_token");
    if (token && !isInitialSyncRef.current) {
      updatePreferencesMutation.mutate({ font_size: fontSize });
    }
  }, [fontSize]);

  // --- 处理字体变化及远程同步 ---
  useEffect(() => {
    const root = document.documentElement;
    const selectedFont = FONTS.find((f) => f.id === font) || FONTS[0]; // fallback to system

    // 设置 CSS 变量，确保使用 Tailwind 的地方生效
    root.style.setProperty("--font-sans", selectedFont.family);
    root.style.setProperty("--font-heading", selectedFont.family);
    // 强制覆盖 document.body 和 html 的字体
    document.body.style.fontFamily = selectedFont.family;
    root.style.fontFamily = selectedFont.family;

    // 存储到 localStorage
    localStorage.setItem("snapknow-font", selectedFont.id);
    localStorage.setItem("snapknow-ui-font", selectedFont.id);

    // 动态加载外部字体 (Google Fonts)
    const loadGoogleFont = (urlParam?: string) => {
      if (!urlParam) return;
      const linkId = `google-font-${urlParam.split(':')[0]}`;
      if (document.getElementById(linkId)) return;

      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${urlParam}&display=swap`;
      document.head.appendChild(link);
    };

    loadGoogleFont(selectedFont.url);

    // 如果用户已登录，且不是初次/远程同步带来的变更，则向后端发送 PATCH
    const token = localStorage.getItem("access_token");
    if (token && !isInitialSyncRef.current) {
      updatePreferencesMutation.mutate({ font_family: selectedFont.id });
    }
  }, [font]);

  useEffect(() => {
    isInitialSyncRef.current = false;
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        font,
        setFont,
        fontSize,
        setFontSize,
        uiTheme,
        setUiTheme,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
