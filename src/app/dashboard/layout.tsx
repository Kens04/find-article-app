import "@mantine/charts/styles.css";
import DashboardLayout from "@/components/layout/dashboard";
import type { Metadata } from "next";
import { getSession } from "@/components/hooks/useSession";
import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "FindArticle",
  description:
    "気になる記事やサイトをタスクとして管理し、進捗状況を可視化できるアプリです。記事や学習リソースを登録し、未読・読書中・完了といったステータスで整理することで、後から見返す際も素早く目的の情報にアクセスできます。",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="ja">
      <body>
        <MantineProvider>
          <DashboardLayout session={session}>{children}</DashboardLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
