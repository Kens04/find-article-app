"use client";

import { IconLogout } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { useAuth } from "@/components/hooks/useAuth";

export const LogoutButton = () => {
  const { handleLogout } = useAuth();

  return (
    <Button
      leftSection={<IconLogout size={14} />}
      onClick={handleLogout}
      fullWidth
      variant="filled"
    >
      ログアウト
    </Button>
  );
};