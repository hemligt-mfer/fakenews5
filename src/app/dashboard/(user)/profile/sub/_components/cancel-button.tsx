import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function CancelButton({ subscriptionId }: { subscriptionId: string }) {
    const router = useRouter();
    async function handleClick() {
        const { data, error } = await authClient.subscription.cancel({
            subscriptionId: subscriptionId,
            returnUrl: "http://localhost:3000/dashboard/profile/sub",
        });
    }

    return (
        <Button
            className="cursor-pointer dark:bg-[#F49F1D]/20 dark:text-[#F49F1D] dark:hover:bg-destructive/30 dark:hover:text-destructive"
            variant="destructive"
            onClick={handleClick}
        >
            Cancel
        </Button>
    );
}
