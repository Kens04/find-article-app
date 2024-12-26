import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabaseRouteHandlerClient } from "@/utils/supabase-route-handler-client";

export async function POST(req: Request) {
  try {
    // Supabaseからユーザー情報を取得
    const supabase = supabaseRouteHandlerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, url, status, dueDate, category, isPublic, isFavorite } =
      await req.json();

    const todo = await prisma.todo.create({
      data: {
        title,
        url,
        status,
        dueDate: new Date(dueDate),
        category: category || "未分類",
        isPublic,
        isFavorite,
        userId: session.user.id,
        // 初期値を設定
        sharedAt: isPublic ? new Date() : null,
        text: "",
        completedAt: null,
      },
      // 必要なフィールドのみを選択
      select: {
        id: true,
        title: true,
        url: true,
        status: true,
        dueDate: true,
        category: true,
        isPublic: true,
        isFavorite: true,
        userId: true,
        sharedAt: true,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
