import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export default function CompleteTodoListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Notifications position="bottom-right" />
      {children}
    </>
  );
}
