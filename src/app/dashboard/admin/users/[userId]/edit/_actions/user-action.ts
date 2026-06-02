"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  role: z.string().min(1, "Specify role"),
});

type FormValues = z.infer<typeof formSchema>;
export default async function UserAction(id: string, input: FormValues) {
  const data = formSchema.parse(input);

  const editUser = await prisma.user.update({
    where: { id },
    data: { role: data.role },
  });
  revalidatePath("/dashboard/admin/users");
  return editUser.id;
}
