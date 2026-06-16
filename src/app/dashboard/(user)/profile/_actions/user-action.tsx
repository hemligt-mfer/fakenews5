"use server";
import z from "zod";
import prisma from "@/lib/prisma";

const editUserSchema = z.object({
  id: z.string(),
  email: z.string().max(145),
  name: z.string().max(145),
  city: z.string(),
  country: z.string(),
  street: z.string(),
  zip: z.string(),
  phoneNumber: z.string(),
  birthdate: z.iso.date(),
  image: z.string(),
  authorAlias: z.string().max(20, "Maximum 20 characters"),
});
type EditUserInput = z.infer<typeof editUserSchema>;

export async function EditUser(id: string, input: EditUserInput) {
  const data = editUserSchema.parse(input);

  const existingAuthor = await prisma.author.findUnique({ where: { userId: id } });
  const aliasChanged = existingAuthor?.alias !== data.authorAlias;
  const shouldUpdateAlias = existingAuthor !== null && data.authorAlias && aliasChanged;

  const updateUser = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      user_info: {
        update: {
          birthdate: new Date(data.birthdate),
          phoneNumber: data.phoneNumber,
          address: {
            update: {
              city: data.city,
              country: data.country,
              street: data.street,
              zip: data.zip,
            },
          },
        },
      },
      ...(shouldUpdateAlias
        ? {
            author: {
              update: {
                where: { userId: id },
                data: { alias: data.authorAlias! },
              },
            },
          }
        : {}),
    },
  });
  return updateUser
}
