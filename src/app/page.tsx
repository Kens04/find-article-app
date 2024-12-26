import { getSession } from "@/components/hooks/useSession";
import TopHeader from "@/components/top/header";
import MainSection from "@/components/top/main-section";
import { MantineProvider } from "@mantine/core";

export default async function Home() {
  const session = await getSession();

  return (
    <MantineProvider>
      <TopHeader session={session}>
        <MainSection />
      </TopHeader>
    </MantineProvider>
  );
}
