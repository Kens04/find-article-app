import "@mantine/charts/styles.css";
import DashboardLayout from "@/components/layout/dashboard";
import type { Metadata } from "next";
import { getSession } from "@/components/hooks/useSession";
import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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