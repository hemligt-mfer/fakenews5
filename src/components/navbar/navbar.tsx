import NavbarClient from "./_components/navbar-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let hasPermission = false;

  if (session != null) {
    const res = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: { article: ["create", "update", "delete"] },
      },
      headers: await headers(),
    });
    if (res?.success) {
      hasPermission = true;
    }
  }
  return <NavbarClient hasPermission={hasPermission} />;
}
