import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { supabaseRouteHandlerClient } from "@/utils/supabase-route-handler-client";

export async function PATCH(request: Request) {
  try {
    const supabase = await supabaseRouteHandlerClient();
    const body = await request.json();
    const { userId, name, avatarUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prismaでユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        avatarUrl,
      },
    });

    // Supabaseのユーザー情報を更新（admin APIを使用しない）
    const { data: supabaseUser, error: supabaseError } =
      await supabase.auth.updateUser({
        data: {
          name,
          avatar_url: avatarUrl,
        },
      });

    if (supabaseError) {
      console.error("Error updating Supabase user:", supabaseError);
    } else {
      console.log("Supabase user updated:", supabaseUser);
    }

    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
