import { prisma } from "@/components/lib/db";
import { TodoStatus } from "@/components/todo/type";
import { NextResponse } from "next/server";

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
    const { status } = await req.json();

    console.log("Received PATCH request:", {
      id: params.id,
      status,
    });

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
