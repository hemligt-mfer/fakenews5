"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function verifyPassword(password: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: session.user.email,
        password,
      },
      headers: await headers(),
      asResponse: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Incorrect password" };
  }
}