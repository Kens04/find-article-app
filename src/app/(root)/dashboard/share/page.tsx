import { getSession } from "@/utils/getSession";
import { type ArticleList } from "@/types/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ShareArticleListContent from "@/app/(root)/dashboard/share/components/share-article-list-content";

export default async function Share() {
  const session = await getSession();
  const articles = await prisma.article.findMany();
  const allArticles = articles || [];
  const activeArticles = allArticles.filter(
    (article) => article.isPublic
  ) as ArticleList[];
  const user = await prisma.user.findMany();
  const likes = await prisma.likes.findMany();
  const userSession = session?.user;
  if (!userSession) {
    return redirect("/login");
  }

  return (
    <ShareArticleListContent
      articles={activeArticles}
      session={session}
      user={user}
      likes={likes}
    />
  );
}
