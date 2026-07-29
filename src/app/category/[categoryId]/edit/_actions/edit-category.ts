"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Title name is required")
    .max(25, "Maximum of 25 characters"),
});

export async function editCategory(
  categoryId: string,
  values: z.infer<typeof formSchema>,
) {
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: `Error: ${parsed.error}`,
    };
  }
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { name: parsed.data.name },
    });
  } catch (err) {
    console.error("Failed to update category", err);
    return {
      success: false,
      error: "Something went wrong while updating the category.",
    };
  }

  revalidatePath(`/category/${categoryId}/edit`);
  return { success: true };
}
