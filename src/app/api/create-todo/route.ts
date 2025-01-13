import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabaseRouteHandlerClient } from "@/utils/supabase-route-handler-client";

export async function POST(req: Request) {
  try {
    // Supabaseからユーザー情報を取得
    const supabase = await supabaseRouteHandlerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      title,
      url,
      status,
      dueDate,
      category,
      isPublic,
      isFavorite,
      isToday,
    } = body;

    // タイムゾーンを考慮した日付を作成
    const adjustedDueDate = new Date(dueDate);
    adjustedDueDate.setHours(23, 59, 59, 999);

    const todo = await prisma.todo.create({
      data: {
        title,
        url,
        status,
        dueDate: adjustedDueDate,
        category: category || "未分類",
        isPublic,
        isFavorite,
        isToday,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data: todo });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: error }),
      { status: 500 }
    );
  }
}
