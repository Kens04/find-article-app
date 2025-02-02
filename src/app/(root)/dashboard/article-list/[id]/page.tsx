import "@mantine/tiptap/styles.css";
import { ArticleDetail } from "@/utils/action";
import ArticleDetailContent from "@/components/article/article-detail-content";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await ArticleDetail({ params });
  const article = data.data;
  return <ArticleDetailContent article={article} />;
}
