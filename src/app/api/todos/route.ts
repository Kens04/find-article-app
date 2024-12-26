import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json({ data: todos });
  } catch (err) {
    return NextResponse.json(err);
  }
}
