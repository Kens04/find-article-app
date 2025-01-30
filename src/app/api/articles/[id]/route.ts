import { ArticleStatus } from "@/components/article/type";
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
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Articleが見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: article }, { status: 200 });
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
    const article = await prisma.article.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ data: article }, { status: 200 });
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

    // タイムゾーンを考慮した日付を作成
    const adjustedDueDate = new Date(dueDate);
    adjustedDueDate.setHours(23, 59, 59, 999);

    // 編集フォームからの更新の場合
    if (title !== undefined) {
      const article = await prisma.article.update({
        where: { id },
        data: {
          title,
          text,
          url,
          category,
          dueDate: adjustedDueDate,
          isToday: isToday,
        },
      });
      return NextResponse.json({ success: true, data: article });
    }

    // 共有のみの更新の場合
    if (isPublic !== undefined) {
      const article = await prisma.article.update({
        where: {
          id: id,
        },
        data: {
          isPublic,
          sharedAt: isPublic ? new Date() : null,
        },
      });
      return NextResponse.json({ success: true, data: article }, { status: 200 });
    }

    // お気に入りのみの更新の場合
    if (isFavorite !== undefined) {
      const article = await prisma.article.update({
        where: {
          id: id,
        },
        data: {
          isFavorite,
        },
      });
      return NextResponse.json({ success: true, data: article }, { status: 200 });
    }

    // ステータスの更新の場合
    if (status !== undefined) {
      // statusが有効なArticleStatusの値であることを確認
      if (!Object.values(ArticleStatus).includes(status as ArticleStatus)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }

      const article = await prisma.article.update({
        where: {
          id: id,
        },
        data: {
          status: status as ArticleStatus,
          completedAt: status === ArticleStatus.COMPLETED ? new Date() : null,
          isToday: status === ArticleStatus.COMPLETED ? false : isToday,
        },
      });

      return NextResponse.json({ success: true, data: article }, { status: 200 });
    }

    // 本日のみの更新の場合
    if (isToday !== undefined && status === undefined) {
      const article = await prisma.article.update({
        where: {
          id: id,
        },
        data: {
          isToday,
        },
      });
      return NextResponse.json({ success: true, data: article }, { status: 200 });
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
