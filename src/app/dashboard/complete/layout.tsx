import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export default function CompleteTodoListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider>
      <Notifications position="bottom-right" />
      {children}
    </MantineProvider>
  );
}
