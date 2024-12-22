import { prisma } from "@/components/lib/db";
import { TodoStatus } from "@/components/todo/type";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!todo) {
      return NextResponse.json(
        { message: "TODOが見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json({ todo }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await prisma.todo.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(todo, { status: 200 });
  } catch (err) {
    return NextResponse.json(err);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, completedAt, text, isPublic, isFavorite } =
      await req.json();

    console.log("Received PATCH request:", {
      id: params.id,
      status,
      completedAt,
      text,
      isPublic,
      isFavorite,
    });

    // テキストのみの更新の場合
    if (text) {
      const todo = await prisma.todo.update({
        where: {
          id: params.id,
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
          id: params.id,
        },
        data: {
          isPublic,
        },
      });
      return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }

    // お気に入りのみの更新の場合
    if (isFavorite !== undefined) {
      const todo = await prisma.todo.update({
        where: {
          id: params.id,
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
        id: params.id,
      },
      data: {
        status: status as TodoStatus,
        completedAt: status === TodoStatus.COMPLETED ? new Date() : null,
      },
    });

    console.log("Updated todo:", todo);
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
