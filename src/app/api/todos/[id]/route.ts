import { TodoStatus } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    if (!todo) {
      return NextResponse.json(
        { message: "TODOが見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: todo }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const todo = await prisma.todo.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ data: todo }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const { status, text, isPublic, isFavorite } = await req.json();

    // テキストのみの更新の場合
    if (text) {
      const todo = await prisma.todo.update({
        where: {
          id: id,
        },
        data: {
          text,
        },
      });
      return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }

    // 共有のみの更新の場合
    if (isPublic !== undefined) {
      const todo = await prisma.todo.update({
        where: {
          id: id,
        },
        data: {
          isPublic,
          sharedAt: isPublic ? new Date() : null,
        },
      });
      return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }

    // お気に入りのみの更新の場合
    if (isFavorite !== undefined) {
      const todo = await prisma.todo.update({
        where: {
          id: id,
        },
        data: {
          isFavorite,
        },
      });
      return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }

    // statusが有効なTodoStatusの値であることを確認
    if (!Object.values(TodoStatus).includes(status as TodoStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        status: status as TodoStatus,
        completedAt: status === TodoStatus.COMPLETED ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: todo }, { status: 200 });
  } catch (err) {
    console.error("Error in PATCH handler:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
