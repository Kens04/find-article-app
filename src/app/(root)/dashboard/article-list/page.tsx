import { getSession } from "@/utils/getSession";
import { ArticleStatus, type ArticleList } from "@/components/article/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ArticleListContent from "@/components/article/article-list/article-list-content";

export default async function ArticleList() {
  return <ArticleListInner />;
}

async function ArticleListInner() {
  const session = await getSession();
  const articles = await prisma.article.findMany();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  const allArticles = articles || [];
  const activeArticles = allArticles.filter(
    (article) => article.status !== ArticleStatus.COMPLETED
  ) as ArticleList[];

  return <ArticleListContent articles={activeArticles} session={session} />;
}
