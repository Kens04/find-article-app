import {
  IconBooks,
  IconCalendar,
  IconChecklist,
  IconDashboard,
  IconPlus,
  IconShare,
  IconStar,
} from "@tabler/icons-react";
import { Flex } from "@mantine/core";

import classes from "./dashboard.module.css";
import { BookIcon } from "@/components/icon/book";
import Link from "next/link";
import { Session } from "@supabase/auth-helpers-nextjs";
import { UserMenu } from "./user-menu";
import { UserAvatar } from "@/components/layout/user-avatar";
import DashboardNav from "@/components/layout/dashboard-nav";

const data = [
  { link: "/dashboard", label: "ダッシュボード", icon: IconDashboard },
  { link: "/dashboard/create-article", label: "記事作成", icon: IconPlus },
  { link: "/dashboard/article", label: "本日の記事", icon: IconCalendar },
  { link: "/dashboard/article-list", label: "記事リスト", icon: IconChecklist },
  { link: "/dashboard/complete", label: "完了リスト", icon: IconBooks },
  { link: "/dashboard/favarite", label: "お気に入り", icon: IconStar },
  { link: "/dashboard/share", label: "共有", icon: IconShare },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

const DashboardLayout = ({ children, session }: DashboardLayoutProps) => {
  const user = session?.user;

  const links = data.map((item) => (
    <Link className={classes.link} href={item.link} key={item.label}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <Flex className={classes.dashboard}>
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
          <UserMenu>
            <UserAvatar
              avatarUrl={user ? user?.user_metadata.avatar_url : "/default.png"}
              userName={user?.user_metadata.name || ""}
            />
          </UserMenu>
        </div>
        <DashboardNav
          avatarUrl={user ? user?.user_metadata.avatar_url : "/default.png"}
          userName={user?.user_metadata.name || ""}
        />
      </nav>
      {children}
    </Flex>
  );
};

export default DashboardLayout;
