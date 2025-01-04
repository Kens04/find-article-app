import { getSession } from "@/components/hooks/useSession";
import ProfileForm from "@/components/profile/profile-form";
import { prisma } from "@/lib/db";

export default async function Profile() {
  const session = await getSession();
  const user = await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      avatarUrl: null,
    },
  });
  return (
    <>
      <ProfileForm session={session} user={user} />
    </>
  );
}
