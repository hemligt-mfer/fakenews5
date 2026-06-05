"use server";

import prisma from "@/lib/prisma";

export async function userCountryChart() {
  const usercountry = await prisma.user.findMany({
    select: {
      user_info: { include: { address: { select: { country: true } } } },
    },
  });

  const countryCounts = usercountry.reduce<Record<string, number>>(
    (acc, user) => {
      const country = user.user_info?.address?.country;
      if (!country) return acc;
      acc[country] = (acc[country] ?? 0) + 1;
      return acc;
    },
    {},
  );

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

export async function topCommenter(){
  const result = await prisma.user.groupBy({
    by: ["id"],
    _count: { id: true},
    orderBy: { _count: {id: "desc"}},
    take: 1,
  })

  if(!result.length){
    return {user:{ name: ""}, commentCount: 0}
  }

  const topUser = await prisma.user.findUnique({
    where: { id: result[0].id },
    select: { name: true }
  })
  return { user: topUser, commentCount: result[0]._count.id}
}

export async function topViewedArticle(){
const result = await prisma.articleView.groupBy({
  by: ["articleId"],
  _count: {articleId: true},
  orderBy: { _count: {articleId: "desc"}},
  take: 1,
})

const articles = await prisma.article.findMany({
  where: {id: {in : result.map((r) => r.articleId)},
  deleted: null
},
  select: {id: true, title: true}
})
return result.map((r) => ({
  articleId: r.articleId,
  title: articles.find((a) => a.id === r.articleId)?.title,
  views: r._count.articleId
}))
}

export async function topLikedArticle(){
  const result = await prisma.articleReaction.groupBy({
    by: ["article_id"],
    _count: {article_id: true},
    orderBy: {_count: {article_id: "desc"}},
    take: 2
  })
  const articles = await prisma.article.findMany({
    where: { id: { in: result.map((r) => r.article_id)}, 
  deleted: null},
  select: {id: true, title: true}
    
  })

  return result.map((r) => ({
    articleId: r.article_id,
    title: articles.find((a) => a.id === r.article_id)?.title,
    likes: r._count.article_id
  }))
}


