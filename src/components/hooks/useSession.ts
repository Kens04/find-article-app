import { createServerComponentClient, Session } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getSession(): Promise<Session | null> {
  const supabase = createServerComponentClient({ cookies });
  const { data: user } = await supabase.auth.getSession();
  const session = user.session;

  return session;
};