import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(`${requestUrl.origin}?error=Authentication failed`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}