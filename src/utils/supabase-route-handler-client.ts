import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const supabaseRouteHandlerClient = cache(async () => {
  const cookieStore = cookies();
  return createRouteHandlerClient({
    cookies: () => Promise.resolve(cookieStore),
  });
});
