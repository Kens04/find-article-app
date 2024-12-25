import { supabaseServer } from "@/utils/supabase-server";
import { Session } from "@supabase/auth-helpers-nextjs";

export async function getSession(): Promise<Session | null> {
  const supabase = supabaseServer();
  const { data: user } = await supabase.auth.getSession();
  const session = user.session;

  return session;
};