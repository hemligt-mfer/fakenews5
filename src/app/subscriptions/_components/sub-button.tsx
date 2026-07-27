"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function SubButton({
    plan,
    disabled,
    annual,
    userSubId,
    label,
}: {
    plan: string;
    annual: boolean | undefined;
    disabled: boolean;
    userSubId: string | undefined;
    label: string;
}) {
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        setLoading(true);
        if (!annual) {
            const res = await authClient.subscription.upgrade({
                plan: plan,
                successUrl: "http://localhost:3000/dashboard/profile/sub",
                returnUrl: "http://localhost:3000/dashboard/profile/sub",
                subscriptionId: userSubId,
            });
        } else {
            const res = await authClient.subscription.upgrade({
                plan: plan,
                successUrl: "http://localhost:3000/dashboard/profile/sub",
                returnUrl: "http://localhost:3000/dashboard/profile/sub",
                annual: true,
                subscriptionId: userSubId,
            });
        }
        setLoading(false);
    };

    return (
        <Button className="cursor-pointer" onClick={() => handleClick()} disabled={disabled}>
            {loading ? <Spinner /> : label}
        </Button>
    );
}
