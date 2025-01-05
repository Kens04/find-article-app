import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const supabaseServer = cache(async () => {
  const cookieStore = await cookies();
  return createServerComponentClient({ cookies: async () => cookieStore });
});
