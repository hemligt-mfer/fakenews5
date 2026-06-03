"use server";
import RouteHeading from "@/components/route-heading";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import UserDetailsTable from "./_components/user-details-table";
import { notFound } from "next/navigation";

export default async function UserDetailsPage(
  props: PageProps<"/dashboard/admin/users/[userId]">,
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
  if(!user){
    return notFound()
  }
  return (
    <div>
      <RouteHeading label="User details" />
      <div className="border bg-sidebar rounded-2xl m-6 px-6 py-2">
        <p className="truncate max-w-20 md:max-w-full text-center">ID: {user.id}</p>
        
        
        <UserDetailsTable data={user} />
        <p className="mb-5 text-center">
          Created at: {new Intl.DateTimeFormat("sv-SE").format(user?.createdAt)}
        </p>
        <Button asChild variant="outline">
        <Link href={`/dashboard/admin/users`}>Back to user table</Link>
      </Button>
      <Button asChild>
        <Link href={`/dashboard/admin/users/${user.id}/edit`}>
          Edit user
        </Link>
      </Button>
      </div>
    </div>
  );
}
