import { getSession } from "@/components/hooks/useSession";
import TopHeader from "@/components/top/header";
import MainSection from "@/components/top/main-section";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <TopHeader session={session}>
        <MainSection />
      </TopHeader>
    </>
  );
}
