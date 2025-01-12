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
    const body = await req.json();
    const {
      status,
      text,
      isPublic,
      isFavorite,
      isToday,
      title,
      url,
      category,
      dueDate,
    } = body;

    // 編集フォームからの更新の場合
    if (title !== undefined) {
      const todo = await prisma.todo.update({
        where: { id },
        data: {
          title,
          url,
          category,
          dueDate: new Date(dueDate),
          isToday: isToday,
        },
      });
      return NextResponse.json({ success: true, data: todo });
    }

    // テキストのみの更新の場合
    if (text !== undefined) {
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

    // ステータスの更新の場合
    if (status !== undefined) {
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
          isToday: status === TodoStatus.COMPLETED ? false : isToday,
        },
      });

      return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }

    // 本日のみの更新の場合
    if (isToday !== undefined && status === undefined) {
      const todo = await prisma.todo.update({
        where: {
          id: id,
        },
        data: {
          isToday,
        },
      });
      return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "No valid update fields provided",
      },
      { status: 400 }
    );
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
