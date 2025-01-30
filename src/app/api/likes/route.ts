import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, articleId } = await req.json();

  try {
    const existingLike = await prisma.likes.findFirst({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { message: "既にいいね済みです" },
        { status: 400 }
      );
    }

    const like = await prisma.likes.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });

    return NextResponse.json({ success: true, data: like }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId, articleId } = await req.json();

  try {
    const like = await prisma.likes.deleteMany({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    return NextResponse.json({ success: true, data: like }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
