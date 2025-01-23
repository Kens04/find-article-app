import { getSession } from "@/components/hooks/useSession";
import ProfileForm from "@/components/profile/profile-form";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getSession();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return redirect("/login");
  }

  return <ProfileForm session={session} user={user} />;
}
