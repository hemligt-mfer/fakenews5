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


