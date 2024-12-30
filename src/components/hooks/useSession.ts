import { supabaseServer } from "@/utils/supabase-server";
import { cache } from "react";

export const getSession = cache(async () => {
  const supabase = await supabaseServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
});
