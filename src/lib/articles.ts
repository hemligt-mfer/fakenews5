// In-memory "database" stand-in.
//
// This is where Prisma would go once it's installed. The function signatures
// below are intentionally shaped like a thin data-access layer so that swapping
// this file for real Prisma calls is a one-spot change — nothing in the server
// action or the UI has to know how articles are persisted.

export type Article = {
  id: string;
  title: string;
  summary: string;
  // Markdown produced by the Tiptap editor.
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewArticle = Pick<Article, "title" | "summary" | "content">;

// Module-level array survives across requests during a single `next dev`
// process. It resets on restart — good enough to demo the flow without a DB.
const articles: Article[] = [];

let nextId = 1;

export async function createArticle(input: NewArticle): Promise<Article> {
  const now = new Date();
  const article: Article = {
    id: String(nextId++),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  articles.push(article);

  // --- With Prisma this becomes: ---
  //
  //   import { prisma } from "@/lib/prisma";
  //
  //   return prisma.article.create({
  //     data: {
  //       title: input.title,
  //       summary: input.summary,
  //       content: input.content,
  //     },
  //   });
  //
  // ...backed by a schema like:
  //
  //   model Article {
  //     id        String   @id @default(cuid())
  //     title     String
  //     summary   String
  //     content   String   // markdown
  //     createdAt DateTime @default(now())
  //     updatedAt DateTime @updatedAt
  //   }

  return article;
}

export async function listArticles(): Promise<Article[]> {
  // Prisma: return prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return [...articles].reverse();
}

export async function getArticle(id: string): Promise<Article | null> {
  // Prisma: return prisma.article.findUnique({ where: { id } });
  return articles.find((a) => a.id === id) ?? null;
}