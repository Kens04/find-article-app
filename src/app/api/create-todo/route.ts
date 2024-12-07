import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/components/lib/db";

export async function POST(req: Request) {
  try {
    // Supabaseからユーザー情報を取得
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, url, status, dueDate, category, isPublic } = await req.json();

    // まずユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // ユーザーが存在しない場合は作成
    if (!user) {
      await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          avatarUrl: session.user.user_metadata.avatar_url,
        },
      });
    }

    // Todoを作成
    const todo = await prisma.todo.create({
      data: {
        title,
        url,
        status,
        dueDate: new Date(dueDate),
        category,
        isPublic,
        userId: session.user.id,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
