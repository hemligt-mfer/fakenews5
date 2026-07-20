"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(1000, "Between 1-1000 characters"),
    content: z.string().min(1, "Content text is required"),
    image: z.string(),
    category: z.array(z.string()),
    location: z.string(),
    author: z.array(z.string()),
});

type AddArticleValues = z.infer<typeof formSchema>;

export default async function addArticle(values: AddArticleValues): Promise<Result<string>> {
    const data = formSchema.parse(values);

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return { success: false, error: "You must be signed in to publish an article." };
    }

    const { success } = await auth.api.userHasPermission({
        body: {
            userId: session.user.id,
            permissions: { article: ["create"] },
        },
    });
    if (!success) redirect("/");

    try {
        // Connect any typed aliases that already exist as authors
        const existingAuthors = await prisma.author.findMany({
            where: {
                alias: { in: data.author },
            },
            select: { id: true, alias: true },
        });

        const authorIds = existingAuthors.map(({ id }) => ({ id }));

        // The writer is always credited. If they have no Author record yet,
        // create one on the fly — named by their typed alias if it's new,
        // otherwise by their account name.
        let writerAuthor = await prisma.author.findUnique({
            where: { userId: session.user.id },
        });

        if (!writerAuthor) {
            const matchedAliases = existingAuthors.map((a) => a.alias);
            const newAlias =
                data.author.find((alias) => !matchedAliases.includes(alias)) ?? session.user.name;

            writerAuthor = await prisma.author.create({
                data: {
                    alias: newAlias,
                    userId: session.user.id,
                },
            });
        }

        if (!authorIds.some(({ id }) => id === writerAuthor.id)) {
            authorIds.push({ id: writerAuthor.id });
        }

        const newArticle = await prisma.article.create({
            data: {
                title: data.title,
                content: data.content,
                summary: data.summary,
                image: data.image,
                location: data.location,
                author: {
                    connect: authorIds,
                },
                category: {
                    connectOrCreate: data.category.map((category) => ({
                        where: { name: category },
                        create: {
                            name: category,
                        },
                    })),
                },
            },
        });
        return { success: true, data: newArticle.id };
    } catch (err) {
        return { success: false, error: `Error ${err}` };
    }
}
