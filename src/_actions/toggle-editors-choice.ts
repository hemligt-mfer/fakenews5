"use server";

import prisma from "@/lib/prisma";


export default async function ToggleChoice(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    select: { editorsChoice: true },
  });

  const updated = await prisma.article.update({
    where: { id },
    data: { editorsChoice: !article?.editorsChoice },
  });
  return updated.editorsChoice;
}
