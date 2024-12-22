import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export default function TodoListLayout({
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
