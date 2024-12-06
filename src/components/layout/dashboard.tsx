"use client";

import { useState } from "react";
import {
  IconBooks,
  IconChecklist,
  IconDashboard,
  IconLogout,
  IconPlus,
  IconShare,
  IconStar,
} from "@tabler/icons-react";
import { Avatar, Button, Flex, Group, Menu, rem } from "@mantine/core";

import classes from "./dashboard.module.css";
import { BookIcon } from "@/components/icon/book";
import Link from "next/link";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/components/hooks/useAuth";

const data = [
  { link: "/dashboard", label: "ダッシュボード", icon: IconDashboard },
  { link: "/dashboard/create-todo", label: "TODO作成", icon: IconPlus },
  { link: "/dashboard/todo-list", label: "TODOリスト", icon: IconChecklist },
  { link: "/dashboard/complete", label: "完了リスト", icon: IconBooks },
  { link: "/dashboard/favarite", label: "お気に入り", icon: IconStar },
  { link: "/dashboard/share", label: "共有", icon: IconShare },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

const DashboardLayout = ({ children, session }: DashboardLayoutProps) => {
  const [active, setActive] = useState<number | string>(0);
  const user = session?.user;
  const { handleLogout } = useAuth();

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <Flex>
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Link href="/dashboard">
            <Flex className={classes.header} align="center">
              <BookIcon fontSize={5} />
              <strong>FindArticle</strong>
            </Flex>
          </Link>
          {links}
        </div>
        <div className={classes.footer}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group className={classes.avatarIcon}>
              <Avatar
                src={user ? user?.user_metadata.avatar_url : "/default.png"}
                alt={user?.user_metadata.name}
              />
              <span>{user?.user_metadata.name}</span>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconDashboard style={{ width: rem(14), height: rem(14) }} />
                }
              >
                <Link href="/dashboard">設定</Link>
              </Menu.Item>
              <Menu.Item>
                <Button
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                  fullWidth
                  variant="filled"
                >
                  ログアウト
                </Button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </nav>
      {children}
    </Flex>
  );
};

export default DashboardLayout;
