import "@mantine/tiptap/styles.css";
import { TodoDetail } from "@/components/todo/action";
import TodoDetailContent from "@/components/todo/todo-detail-content";

export default async function TodoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { todo } = await TodoDetail({ params });
  return <TodoDetailContent todo={todo} />;
}
