import "@mantine/tiptap/styles.css";
import "@mantine/dates/styles.css";
import { handleEdit } from "@/utils/action";
import EditForm from "@/components/article/edit/edit-form";

export default async function EditArticleListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await handleEdit(id);
  return <EditForm article={article} />;
}
