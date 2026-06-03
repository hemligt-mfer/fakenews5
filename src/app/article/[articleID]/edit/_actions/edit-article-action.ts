"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(200, "Max 200 characters"),
    content: z.string().min(1, "Content is required"),
    image: z.string(),
    location: z.string(),
    category: z.array(z.string()),
    author: z.array(z.string()),
});

type EditArticleValues = z.infer<typeof formSchema>;

export async function getArticleForEdit(articleId: string) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: {
                id: true,
                title: true,
                summary: true,
                content: true,
                image: true,
                location: true,
                category: { select: { name: true } },
                author: { select: { alias: true } },
            },
        });
        if (!article) return { success: false as const, error: "Article not found." };
        return { success: true as const, data: article };
    } catch (err) {
        return { success: false as const, error: `Failed to load article: ${err}` };
    }
}

export async function editArticle(
    articleId: string,
    values: EditArticleValues,
): Promise<Result<string>> {
    try {
        const data = formSchema.parse(values);

        const authors = await prisma.author.findMany({
            where: { alias: { in: data.author } },
            select: { id: true },
        });

        await prisma.article.update({
            where: { id: articleId },
            data: {
                title: data.title,
                summary: data.summary,
                content: data.content,
                image: data.image,
                location: data.location,
                updatedAt: new Date(),
                author: {
                    set: authors.map(({ id }) => ({ id })),
                },
                category: {
                    set: [],
                    connectOrCreate: data.category.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
            },
        });

        return { success: true, data: articleId };
    } catch (err) {
        console.error("[editArticle error]", err);
        return { success: false, error: `Failed to update article: ${err}` };
    }
}
