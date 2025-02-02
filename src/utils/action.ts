import {
  CreateArticleInput,
  EditArticleInput,
  ArticleStatus,
} from "@/types/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleDelete = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete article: ${response.statusText}`);
  }
  const { data } = await response.json();
  return data;
};

export const handleEdit = async (id: string, values?: EditArticleInput) => {
  try {
    // GETリクエストの場合
    if (!values) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }

      const { data } = await response.json();
      return data;
    }

    // PATCHリクエストの場合
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          url: values.url,
          category: values.category,
          dueDate: values.dueDate,
          text: values.text,
          isToday: values.isToday,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update article: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error in handleEdit:", error);
    throw error;
  }
};

export const createArticle = async (article: CreateArticleInput) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/create-article`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      }
    );

    if (!response.ok) {
      console.error(
        "Create article response:",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createArticle:", error);
    throw error;
  }
};

export const ArticleDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get article detail: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const handleUpdateStatus = async ({
  id,
  status,
  isToday,
}: {
  id: string;
  status: ArticleStatus;
  isToday: boolean | null;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          status,
          isToday,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const handleTextSave = async ({
  id,
  text,
}: {
  id: string;
  text: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update text: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating text:", error);
    throw error;
  }
};

export const handleIsPublic = async ({
  id,
  isPublic,
  sharedAt,
}: {
  id: string;
  isPublic: boolean;
  sharedAt: Date;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ isPublic: isPublic, sharedAt: sharedAt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update public`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating public:", error);
    throw error;
  }
};

export const handleFavorite = async ({
  id,
  isFavorite,
}: {
  id: string;
  isFavorite: boolean;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ isFavorite: isFavorite }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update favorite`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating favorite:", error);
    throw error;
  }
};

export const handleToday = async ({
  id,
  isToday,
}: {
  id: string;
  isToday: boolean;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ isToday: isToday }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update today`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating today:", error);
    throw error;
  }
};

export const handleDeleteClick = async (
  router: AppRouterInstance,
  id: string
) => {
  try {
    await handleDelete(id);
    router.refresh();
  } catch (err) {
    throw err;
  }
};

export const handleShareClick = async (
  router: AppRouterInstance,
  id: string,
  isPublic: boolean,
  sharedAt: Date
) => {
  try {
    await handleIsPublic({
      id: id,
      isPublic: !isPublic,
      sharedAt: new Date(sharedAt),
    });
    router.refresh();
  } catch (error) {
    console.error("public update failed:", error);
    throw error;
  }
};

export const handleProfileUpdate = async ({
  id,
  name,
  avatar_url,
}: {
  id: string;
  name: string;
  avatar_url?: string | null;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/profile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          name,
          avatarUrl: avatar_url,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update profile: ${errorData.error || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
