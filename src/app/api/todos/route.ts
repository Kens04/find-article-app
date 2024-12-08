import { prisma } from "@/components/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos);
  } catch (err) {
    return NextResponse.json(err);
  }
}
