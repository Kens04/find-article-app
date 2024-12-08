import { prisma } from "@/components/lib/db";
import { NextResponse } from "next/server";

export async function DELETE( req: Request,
  { params }: { params: { id: string } }) {
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
