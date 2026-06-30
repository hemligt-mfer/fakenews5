"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addView } from "@/_actions/article-actions";

export async function saveConsent(consent: boolean) {
    const cookieStore = await cookies();
    cookieStore.set("cookie_consent", consent ? "yes" : "no", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });
}

export async function getConsent() {
    const cookieStore = await cookies();
    const consent = cookieStore.get("cookie_consent");
    return consent;
}

export async function getViewedArticles() {
    const cookieStore = await cookies();
    const viewedArticles = cookieStore.get("viewed_articles");
    return viewedArticles;
}

export async function markArticleAsViewed(articleId: string) {
    const cookieStore = await cookies();
    const viewedArticles = await getViewedArticles();

    if (viewedArticles == undefined) {
        cookieStore.set("viewed_articles", articleId + "/", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
        });
        await addView(articleId);
    } else {
        // Check if the article is already marked as viewed
        const articleIdsString = viewedArticles?.value;
        const idsArray = articleIdsString.toString().split("/");
        for (const id of idsArray) {
            if (id === articleId) {
                return;
            }
        }
        cookieStore.set("viewed_articles", viewedArticles.value + articleId + "/", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
        });
        await addView(articleId);
    }
}
