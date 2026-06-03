"use server";
import RouteHeading from "@/components/route-heading";
import prisma from "@/lib/prisma";
import EditUserForm from "./_components/edit-user-form";
import { notFound } from "next/navigation";

export default async function EditUserPage(
  props: PageProps<"/dashboard/admin/users/[userId]/edit">,
) {
  const params = await props.params;
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      user_info: {
        select: {
          address: true,
          birthdate: true,
          phoneNumber: true,
          id: true,
          userId: true,
        },
      },
      author: true,
    },
  });
  if (!user) {
    return notFound();
  }

  return (
    <div>
      <RouteHeading label="Edit user" />
      <EditUserForm data={user} />
    </div>
  );
}
