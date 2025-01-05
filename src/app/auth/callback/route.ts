import { NextRequest, NextResponse } from "next/server";
import { supabaseRouteHandlerClient } from "@/utils/supabase-route-handler-client";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await supabaseRouteHandlerClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}?error=Authentication failed`
      );
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
}