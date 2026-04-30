import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthMutation } from "@/features/auth/useAuthMutation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const { mutateAsync: authenticate, isPending: isLoading } = useAuthMutation();

  const title = useMemo(() => {
    return isLogin ? "登录" : "注册";
  }, [isLogin]);

  const subtitle = useMemo(() => {
    return isLogin
      ? "使用手机号和密码继续"
      : "创建账号后即可开始使用";
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("请填写手机号和密码");
      return;
    }

    try {
      await authenticate({ phone, password, isLogin });
      navigate("/");
    } catch {
      return;
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-foreground/5 ring-1 ring-foreground/10" />
              <div className="leading-tight">
                <div className="text-sm font-medium">SnapKnow</div>
                <div className="text-xs text-muted-foreground">AI 个人知识库</div>
              </div>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>

            <CardContent>
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10"
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="h-10 w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? "登录" : "注册"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center">
              <div className="text-sm text-muted-foreground">
                {isLogin ? "没有账号？" : "已经有账号？"}
                <Button
                  type="button"
                  variant="link"
                  className="px-1"
                  onClick={() => setIsLogin((v) => !v)}
                >
                  {isLogin ? "去注册" : "去登录"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
