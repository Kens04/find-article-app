import TopDashboardContent from "@/components/dashboard/top-dashboard-content";
import { getSession } from "@/utils/getSession";
import { type ArticleList } from "@/types/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const articles = await prisma.article.findMany();
  const allArticles = articles as ArticleList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return <TopDashboardContent articles={allArticles} session={session} />;
}
