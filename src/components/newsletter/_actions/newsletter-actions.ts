"use server";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

type NewsletterSettings = {
  id: string;
  user_id: string;
  email: string;
  active: boolean;
};

export async function setNewsletterSettings(
  userId: string,
  email: string,
  authors: string[],
  categories: string[],
): Promise<Result<NewsletterSettings>> {
  if (await isEmailSubscribed(email, userId)) {
    console.error("Email is already in use.");
    return { success: false, error: "Email is already in use." };
  }
  try {
    const authorIds: { id: string }[] = [];
    for (const a of authors) {
      const author = await prisma.author.findUnique({ where: { alias: a } });
      if (author) {
        authorIds.push({ id: author.id });
      }
    }
    const categoryIds: { id: string }[] = [];
    for (const c of categories) {
      const category = await prisma.category.findUnique({ where: { name: c } });
      if (category) {
        categoryIds.push({ id: category.id });
      }
    }
    const res = await prisma.newsletterSettings.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        email: email,
        active: true,
        authors: { connect: authorIds },
        categories: { connect: categoryIds },
      },
      update: {
        user_id: userId,
        email: email,
        active: true,
        authors: { set: authorIds },
        categories: { set: categoryIds },
      },
    });
    if (res) {
      return { success: true, data: res };
    } else {
      return {
        success: false,
        error: "Couldn't write newsletter registration to database.",
      };
    }
  } catch (err) {
    const msg = `An unknown error occurred when trying to register to the newsletter.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function getNewsLettersettingsFromId(
  userId: string,
): Promise<Result<NewsletterSettings>> {
  try {
    const res = await prisma.newsletterSettings.findFirst({
      where: { user_id: userId },
      include: { authors: true, categories: true },
    });
    if (res) {
      return { success: true, data: res };
    } else {
      return {
        success: false,
        error: `Couldn't find newsletter subscription for user id ${userId}.`,
      };
    }
  } catch (err) {
    const msg = `An error occurred when trying to find newsletter settings for user ${userId}.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function isEmailSubscribed(
  email: string,
  excludeUserId?: string,
) {
  const res = await prisma.newsletterSettings.findFirst({
    where: {
      email,
      ...(excludeUserId ? { NOT: { user_id: excludeUserId } } : {}),
    },
  });
  return !!res;
}

export async function defaultSettings(email: string) {
  const data = await prisma.newsletterSettings.findFirst({
    where: { email: email },
    select: { email: true ,authors: true, categories: true, active: true },
  });
  if (data) {
    return data;
  }
  return null;
}

export async function setNewsletterActive(
  userId: string,
  active: boolean,
): Promise<Result<NewsletterSettings>> {
  try {
    const res = await prisma.newsletterSettings.update({
      where: { user_id: userId },
      data: { active },
    });
    return { success: true, data: res };
  } catch (err) {
    const msg = `An error occurred when trying to update newsletter status.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

