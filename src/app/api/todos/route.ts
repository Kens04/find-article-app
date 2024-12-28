import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json({ data: todos });
  } catch (err) {
    console.error("API: Error in GET /api/todos:", err);
    return NextResponse.json(
      { error: "Failed to fetch todos", details: err },
      { status: 500 }
    );
  }
}
