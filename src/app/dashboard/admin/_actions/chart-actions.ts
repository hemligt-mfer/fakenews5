"use server";

import prisma from "@/lib/prisma";
import { CommentRow } from "../_components/charts/user-counts";

export async function userCountryChart() {
    const usercountry = await prisma.user.findMany({
        select: {
            user_info: { include: { address: { select: { country: true } } } },
        },
    });

    const countryCounts = usercountry.reduce<Record<string, number>>((acc, user) => {
        const country = user.user_info?.address?.country;
        if (!country) return acc;
        acc[country] = (acc[country] ?? 0) + 1;
        return acc;
    }, {});

    return Object.entries(countryCounts).map(([country, users]) => ({
        country,
        users,
    }));
}

export async function userReg() {
    const latestUsers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
    });
    return latestUsers;
}

export async function articleCounts() {
    const article = await prisma.article.count();
    if (!article) {
        const article = 0;
        return article;
    }
    return article;
}

export async function userCounts() {
    const users = await prisma.user.count();
    if (!users) {
        const users = 0;
        return users;
    }
    return users;
}

export async function commentCount() {
    const comments = await prisma.comment.count();
    if (!comments) {
        const comments = 0;
        return comments;
    }
    return comments;
}

export async function topCommenter() {
    const result = await prisma.user.groupBy({
        by: ["id"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
    });

    if (!result.length) {
        return { user: { name: "" }, commentCount: 0 };
    }

    const topUser = await prisma.user.findUnique({
        where: { id: result[0].id },
        select: { name: true },
    });
    return { user: topUser, commentCount: result[0]._count.id };
}

// export async function topViewedArticle() {
//   const result = await prisma.articleView.groupBy({
//     by: ["articleId"],
//     _count: { articleId: true },
//     orderBy: { _count: { articleId: "desc" } },
//     take: 1,
//   });

//   const articles = await prisma.article.findMany({
//     where: { id: { in: result.map((r) => r.articleId) }, deleted: null },
//     select: { id: true, title: true },
//   });
//   return result.map((r) => ({
//     articleId: r.articleId,
//     title: articles.find((a) => a.id === r.articleId)?.title,
//     views: r._count.articleId,
//   }));
// }

export async function topLikedArticle() {
    const result = await prisma.articleReaction.groupBy({
        by: ["article_id"],
        _count: { article_id: true },
        orderBy: { _count: { article_id: "desc" } },
        take: 2,
    });
    const articles = await prisma.article.findMany({
        where: { id: { in: result.map((r) => r.article_id) }, deleted: null },
        select: { id: true, title: true },
    });

    return result.map((r) => ({
        articleId: r.article_id,
        title: articles.find((a) => a.id === r.article_id)?.title,
        likes: r._count.article_id,
    }));
}

export async function subscribedUsers() {
    const result = await prisma.subscription.count({
        where: {
            status: { equals: "active" },
        },
    });
    return result;
}

export async function usersNotSubed() {
    const allUsers = await userCounts();
    const subbedUsers = await subscribedUsers();
    const usersNotSubbed = allUsers - subbedUsers;
    return usersNotSubbed;
}
export async function latestSub() {
    const result = await prisma.subscription.findFirst({
        orderBy: { periodStart: "desc" },
        select: { periodStart: true },
    });

    if (!result || result.periodStart === null) return new Date(0);

    return result.periodStart;
}

export async function getWeeklyRevenue() {
    const subscription = await prisma.subscription.findMany({
        where: {
            periodStart: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lte: new Date(),
            },
            status: "active",
        },
        select: {
            periodStart: true,
            billingInterval: true,
            plan: true,
        },
        orderBy: { periodStart: "asc" },
    });
    const plans = await prisma.plan.findMany({
        select: { name: true, price: true, annualPrice: true },
    });
    const planMap = Object.fromEntries(plans.map((p) => [p.name, p]));

    const weeklyMap: Record<string, number> = {};

    for (const sub of subscription) {
        if (!sub.periodStart) continue;
        const planData = planMap[sub.plan];
        if (!planData) continue;
        const amount =
            sub.billingInterval === "year" ? (planData.annualPrice ?? 0) : planData.price;
        const week = String(Math.ceil(sub.periodStart.getDate() / 7));
        weeklyMap[week] = (weeklyMap[week] ?? 0) + amount;
    }
    return [
        { week: "0", income: 0 },
        ...Object.entries(weeklyMap).map(([week, income]) => ({ week, income })),
    ];
}

export async function recentComments(){

    const recentCommentsData = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        content: true,
        createdAt: true,
        article: { select: { title: true } },
        user: { select: { user: { select: { name: true } } } },
      },
    });
    
    const recentComments: CommentRow[] = recentCommentsData.map((c) => ({
      id: c.id,
      content: c.content,
      author: c.user?.user?.name ?? "Unknown",
      article: c.article?.title ?? "—",
      date: c.createdAt.toLocaleDateString(),
      monthKey: c.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }), 
    }));

    return recentComments
}