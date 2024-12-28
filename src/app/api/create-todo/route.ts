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
      console.log("No session found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("Received todo data:", body);

    const { title, url, status, dueDate, category, isPublic, isFavorite } =
      body;

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
      },
    });

    console.log("Created todo:", todo);
    return NextResponse.json({ data: todo });
  } catch (error) {
    console.error("Error creating todo:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: error }),
      { status: 500 }
    );
  }
}
