"use server";

import { roles } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Name is required, atleast 3 characters")
    .max(50, "Maximum of 50 characters"),
  email: z.email(),
  image: z.string(),
  phone: z.string(),
  birthdate: z.iso.date(),
  role: z.enum(roles),
  authorAlias: z.string().max(20, "Maximum 20 characters"),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
  userInfoId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
export default async function UserAction(id: string, input: FormValues) {
  const data = formSchema.parse(input);

  const editUser = await prisma.user.update({
    where: { id },
    data: {
      role: data.role,
      name: data.name,
      email: data.email,
      image: data.image,
      user_info: {
        upsert: {
          update: {
            phoneNumber: data.phone,
            birthdate: new Date(data.birthdate),
            address: {
              upsert: {
                update: {
                  city: data.city,
                  country: data.country,
                  street: data.street,
                  zip: data.zip,
                },
                create: {
                  city: data.city,
                  country: data.country,
                  street: data.street,
                  zip: data.zip,
                },
              },
            },
          },
          create: {
            phoneNumber: data.phone,
            birthdate: new Date(data.birthdate),

            address: {
              connectOrCreate: {
                where: {
                  id: data.userInfoId,
                },
                create: {
                  city: data.city,
                  country: data.country,
                  street: data.street,
                  zip: data.zip,
                },
              },
            },
          },
        },
      },
      author: {
        upsert: {
          update: { alias: data.authorAlias },
          create: { alias: data.authorAlias },
        },
      },
    },
  });
  revalidatePath("/dashboard/admin/users");
  return editUser.id;
}
