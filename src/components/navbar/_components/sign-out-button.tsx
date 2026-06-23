"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type Props = React.ComponentProps<typeof Button>;

export function SignOutButton({ children, disabled, ...props }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const { error } = await authClient.signOut();

    setLoading(false);

    if (error) {
      return toast.error(error.message || "An unknown error occurred", {
        position: "top-center",
      });
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      disabled={loading || disabled}
      onClick={handleClick}
      {...props}
      className="cursor-pointer"
    >
      {loading ? (
        <>
          <Spinner data-icon="inline-start" />
        </>
      ) : (
        children || "Logout"
      )}
    </Button>
  );
}
