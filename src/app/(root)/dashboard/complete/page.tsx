import { getSession } from "@/utils/getSession";
import CompleteArticleListContent from "@/app/(root)/dashboard/complete/components/complete-article-list-content";
import { ArticleStatus, type ArticleList } from "@/types/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CompletedArticleList() {
  const articles = await prisma.article.findMany();
  const allArticles = articles || [];
  const completedArticles = allArticles.filter(
    (article) => article.status == ArticleStatus.COMPLETED
  ) as ArticleList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return (
    <CompleteArticleListContent
      articles={completedArticles}
      session={session}
    />
  );
}
