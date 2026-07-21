"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(1000, "Between 1-1000 characters"),
    content: z.string().min(1, "Content text is required"),
    image: z.string(),
    category: z.array(z.string()),
    location: z.string(),
    author: z.array(z.string()),
});

type EditArticleValues = z.infer<typeof formSchema>;

export default async function editArticle(
    articleId: string,
    values: EditArticleValues,
): Promise<Result<string>> {
    const data = formSchema.parse(values);

    const authors = await prisma.author.findMany({
        where: { alias: { in: data.author } },
        select: { id: true },
    });

    try {
        const updated = await prisma.article.update({
            where: { id: articleId },
            data: {
                title: data.title,
                content: data.content,
                summary: data.summary,
                image: data.image ?? "",
                location: data.location,
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
        return { success: true, data: updated.id };
    } catch (err) {
        return { success: false, error: `Error updating article: ${err}` };
    }
}
