"use client";

import { LogoutButton } from "@/components/form/logout-button";
import { Menu, rem } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";

interface UserMenuProps {
  children: React.ReactNode;
}

export const UserMenu = ({ children }: UserMenuProps) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
          }
        >
          <Link href="/dashboard/profile">プロフィール</Link>
        </Menu.Item>
        <Menu.Item>
          <LogoutButton />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
