import { getSession } from "@/components/hooks/useSession";
import TopHeader from "@/components/top/header";
import MainSection from "@/components/top/main-section";
import { MantineProvider } from "@mantine/core";
import { Suspense } from "react";

export default async function Home() {
  const session = await getSession();

  return (
    <MantineProvider>
      <TopHeader session={session}>
        <Suspense fallback={<div>Loading...</div>}>
          <MainSection />
        </Suspense>
      </TopHeader>
    </MantineProvider>
  );
}
