import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export async function LoginRegButtons() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <ul className="flex">
      {session ? (
        <>
          <li>
            <Button asChild variant="outline" className="">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </li>
          <li>
            <SignOutButton/>
          </li>
        </>
      ) : (
        <>
        <li>
            <Button asChild variant="outline" className="">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </li>{" "}
          {" "}
          <li>
            <Button asChild variant="outline" className="">
              <Link href="/register">Register</Link>
            </Button>
          </li>
        </>
      )}
    </ul>
  );
}
