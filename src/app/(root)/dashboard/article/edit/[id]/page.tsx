import "@mantine/tiptap/styles.css";
import "@mantine/dates/styles.css";
import { handleEdit } from "@/components/article/action";
import EditForm from "@/components/article/edit/edit-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await handleEdit(id);
  return <EditForm article={article} />;
}
