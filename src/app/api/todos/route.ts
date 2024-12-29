import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      // 必要なフィールドのみを取得して最適化
      select: {
        id: true,
        title: true,
        url: true,
        category: true,
        status: true,
        dueDate: true,
        userId: true,
        isFavorite: true,
        isPublic: true,
        sharedAt: true,
      },
      // タイムアウトを設定
      take: 100, // 一度に取得する最大数を制限
    });
    return NextResponse.json({ data: todos });
  } catch (err) {
    console.error("API: Error in GET /api/todos:", err);
    return NextResponse.json(
      { error: "Failed to fetch todos", details: err },
      { status: 500 }
    );
  }
}
