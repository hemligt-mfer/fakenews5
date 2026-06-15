import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function CancelButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const router = useRouter();
  async function handleClick() {
    const { data, error } = await authClient.subscription.cancel({
      subscriptionId: subscriptionId,
      returnUrl: "http://localhost:3000/dashboard/profile/sub",
    });
    router.refresh();
  }

  return (
    <Button
      className="cursor-pointer"
      variant="destructive"
      onClick={handleClick}
    >
      Cancel
    </Button>
  );
}
