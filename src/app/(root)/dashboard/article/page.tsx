import { getSession } from "@/utils/getSession";
import ArticleContent from "@/app/(root)/dashboard/article/components/article-content";
import { type ArticleList } from "@/types/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Article() {
  const articles = await prisma.article.findMany();
  const allArticles = articles || [];
  const activeArticles = allArticles.filter(
    (article) => article.isToday
  ) as ArticleList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return <ArticleContent articles={activeArticles} session={session} />;
}
