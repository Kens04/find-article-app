import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@mantine/notifications/styles.css";

export default function FavoriteArticleListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider>
      <NuqsAdapter>
        <Notifications position="bottom-right" />
        {children}
      </NuqsAdapter>
    </MantineProvider>
  );
}
