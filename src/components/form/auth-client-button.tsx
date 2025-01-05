"use client";

import { BrandGoogle } from "@/components/icon/google";
import { Button } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const AuthClientButton = ({
  text,
  loading,
}: {
  text: string;
  loading?: boolean;
}) => {
  const supabase = createClientComponentClient();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      // ここでエラーメッセージを表示するなどの処理を追加できます
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Button
        size="md"
        fullWidth
        variant="light"
        type="submit"
        loading={loading}
        disabled={loading}
        loaderProps={{ type: "dots" }}
      >
        {text}
      </Button>
      <Button
        size="md"
        onClick={handleLogin}
        fullWidth
        leftSection={<BrandGoogle size={20} />}
        loading={googleLoading}
        disabled={loading || googleLoading}
        loaderProps={{ type: "dots" }}
      >
        Googleでログイン
      </Button>
    </>
  );
};

export default AuthClientButton;
