import "@mantine/tiptap/styles.css";
import "@mantine/dates/styles.css";
import { handleEdit } from "@/components/todo/action";
import EditForm from "@/components/todo/edit/edit-form";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todo = await handleEdit(id);
  return <EditForm todo={todo} />;
}
