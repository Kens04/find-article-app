import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export default function TodoListLayout({
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
