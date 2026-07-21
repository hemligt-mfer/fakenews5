import ChangeEmailDialog from "./_components/change-email-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import ChangePasswordDialog from "./_components/change-password-form";
import RouteHeading from "@/components/route-heading";

export default async function Security() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_info: {
        select: {
          birthdate: true,
          phoneNumber: true,
          address: {
            select: { city: true, country: true, street: true, zip: true },
          },
          bookmark: { select: { article: { select: { category: true } } } },
        },
      },
      author: true,
      accounts: { select: { password: true } },
    },
  });

  return (
    <>
      <RouteHeading label="Security" />
      <ChangeEmailDialog currentEmail={userInfo!.email}></ChangeEmailDialog>
      <ChangePasswordDialog
        currentEmail={userInfo!.email}
      ></ChangePasswordDialog>
    </>
  );
}
