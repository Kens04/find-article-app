"use client";

import {
  IconBooks,
  IconCalendar,
  IconChecklist,
  IconDashboard,
  IconPlus,
  IconShare,
  IconStar,
} from "@tabler/icons-react";
import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import dashboardClasses from "./dashboard.module.css";
import { UserAvatar } from "@/components/layout/user-avatar";
import { UserMenu } from "@/components/layout/user-menu";
import { LogoutButton } from "@/components/form/logout-button";
import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";

const data = [
  { link: "/dashboard", label: "ダッシュボード", icon: IconDashboard },
  { link: "/dashboard/create-todo", label: "TODO作成", icon: IconPlus },
  { link: "/dashboard/todo", label: "本日のTODO", icon: IconCalendar },
  { link: "/dashboard/todo-list", label: "TODOリスト", icon: IconChecklist },
  { link: "/dashboard/complete", label: "完了リスト", icon: IconBooks },
  { link: "/dashboard/favarite", label: "お気に入り", icon: IconStar },
  { link: "/dashboard/share", label: "共有", icon: IconShare },
  { link: "/dashboard/profile", label: "プロフィール", icon: IconUserCircle },
];

interface DashboardNavProps {
  avatarUrl: string;
  userName: string;
}

const DashboardNav = ({ avatarUrl, userName }: DashboardNavProps) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const links = data.map((item) => (
    <Link
      className={dashboardClasses.link}
      href={item.link}
      key={item.label}
      onClick={closeDrawer}
    >
      <item.icon className={dashboardClasses.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <>
      <div>
        <Burger
          className={dashboardClasses.burger}
          opened={drawerOpened}
          onClick={toggleDrawer}
          hiddenFrom="xl"
        />
      </div>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        hiddenFrom="xl"
        zIndex={1000000}
      >
        <div>
          {links}
          <LogoutButton />
        </div>
        <div className={dashboardClasses.avatar}>
          <UserMenu>
            <UserAvatar avatarUrl={avatarUrl} userName={userName} />
          </UserMenu>
        </div>
      </Drawer>
    </>
  );
};

export default DashboardNav;
