import { NextRequest, NextResponse } from "next/server";
import { supabaseRouteHandlerClient } from "@/utils/supabase-route-handler-client";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await supabaseRouteHandlerClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(
        new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL)
      );
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(
        new URL(
          "/?error=Authentication failed",
          process.env.NEXT_PUBLIC_APP_URL
        )
      );
    }
  }

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));
}
