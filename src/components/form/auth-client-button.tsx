"use client";

import { BrandGoogle } from "@/components/icon/google";
import { Button } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const AuthClientButton = () => {
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      // ここでエラーメッセージを表示するなどの処理を追加できます
    }
  };

  return (
    <>
      <Button size="md" fullWidth variant="light">
        ログイン
      </Button>
      <Button
        size="md"
        onClick={handleLogin}
        fullWidth
        leftSection={<BrandGoogle size={20} />}
      >
        Googleでログイン
      </Button>
    </>
  );
};

export default AuthClientButton;
