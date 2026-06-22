"use server";

import { createArticle } from "@/lib/articles";

export type SavedArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
};

export type SaveArticleState = {
  ok: boolean;
  message: string;
  // Field-level validation errors, keyed by input name.
  errors?: Partial<Record<"title" | "summary" | "content", string>>;
  // The persisted article, returned so the UI can render a preview.
  article?: SavedArticle;
};

// Server Action invoked by the article form. Receives the form's FormData,
// validates it, and persists via the data-access layer.
//
// NOTE: a real app must authenticate/authorize here — Server Actions are
// reachable by direct POST, not just through your UI. See the Next.js
// "Mutating Data" guide. Skipped here to keep the example focused.
export async function saveArticle(
  _prevState: SaveArticleState,
  formData: FormData,
): Promise<SaveArticleState> {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  const errors: SaveArticleState["errors"] = {};
  if (!title) errors.title = "A heading is required.";
  if (!summary) errors.summary = "A summary is required.";
  if (!content) errors.content = "The article body can't be empty.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the errors below.", errors };
  }

  const article = await createArticle({ title, summary, content });

  // In a real app you'd typically revalidate a list page and/or redirect:
  //   revalidatePath("/articles");
  //   redirect(`/articles/${article.id}`);
  return {
    ok: true,
    message: `Saved “${article.title}” (id: ${article.id}).`,
    article: {
      id: article.id,
      title: article.title,
      summary: article.summary,
      content: article.content,
    },
  };
}