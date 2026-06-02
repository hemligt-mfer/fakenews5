import RouteHeading from "@/components/route-heading";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function UserDetailsPage(
  props: PageProps<"/dashboard/admin/users/[userId]">,
) {
  const params = await props.params;
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
  });
  return (
    <div className="">
      <RouteHeading label="User details" />
      <div className="flex flex-col border bg-sidebar rounded-2xl m-6 px-6 py-2">
        <p>Email: {user?.email}</p>
        <p>Name: {user?.name}</p>
        <p>Role: {user?.role}</p>
        <p>
          Created at: {new Intl.DateTimeFormat("sv-SE").format(user?.createdAt)}
        </p>
        <Button asChild>
          <Link href={`/dashboard/admin/users/${user?.id}/edit`}>Edit user</Link>
        </Button>
      </div>
      
    </div>
  );
}
