"use client";

import { IconDashboard, IconLogout } from "@tabler/icons-react";
import { Avatar, Box, Button, Group, Menu, rem } from "@mantine/core";

import classes from "./top-header.module.css";
import { BookIcon } from "@/components/icon/book";
import Link from "next/link";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/components/hooks/useAuth";

interface TopHeaderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const TopHeader = ({ children, session }: TopHeaderProps) => {
  const user = session?.user;
  const { handleLogout } = useAuth();

  return (
    <div>
      <Box pb={50}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Link href="/" className={classes.logo}>
              <BookIcon />
              <span>FindArticle</span>
            </Link>

            {user ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar
                    src={user ? user?.user_metadata.avatar_url : "/default.png"}
                    alt={user?.user_metadata.name}
                    className={classes.avatarIcon}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconDashboard
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    <Link href="/dashboard">ダッシューボード</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      leftSection={<IconLogout size={14} />}
                      onClick={handleLogout}
                      fullWidth
                    >
                      ログアウト
                    </Button>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group visibleFrom="sm">
                <Button component={Link} href="/login" variant="default">
                  ログイン
                </Button>
                <Button component={Link} href="/register">
                  新規登録
                </Button>
              </Group>
            )}
          </Group>
        </header>
      </Box>
      {children}
    </div>
  );
};

export default TopHeader;
