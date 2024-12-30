import "@mantine/tiptap/styles.css";
import { TodoDetail } from "@/components/todo/action";
import TodoDetailContent from "@/components/todo/todo-detail-content";

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await TodoDetail({ params });
  const todo = data.data;
  return <TodoDetailContent todo={todo} />;
}
