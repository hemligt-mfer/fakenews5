import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export async function LoginRegButtons() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <ul className="flex">
      {session ? (
        <>
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/">Dashboard</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/">Logout</Link>
            </Button>
          </li>
        </>
      ) : (
        <>
          {" "}
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/register">Register</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          </li>{" "}
        </>
      )}
    </ul>
  );
}
