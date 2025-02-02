import { getSession } from "@/utils/getSession";
import FavariteArticleListContent from "@/components/article/favarite/favarite-article-list-content";
import { type ArticleList } from "@/types/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function FavoriteArticleList() {
  const articles = await prisma.article.findMany();
  const allArticles = articles || [];
  const activeArticles = allArticles.filter(
    (article) => article.isFavorite
  ) as ArticleList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return (
    <FavariteArticleListContent articles={activeArticles} session={session} />
  );
}
