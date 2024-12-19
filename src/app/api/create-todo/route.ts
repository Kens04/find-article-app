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

    const { title, url, status, dueDate, category, isPublic, isFavorite } =
      await req.json();

    const todo = await prisma.todo.create({
      data: {
        title,
        url,
        status,
        dueDate: new Date(dueDate),
        category,
        isPublic,
        isFavorite,
        userId: session.user.id,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
