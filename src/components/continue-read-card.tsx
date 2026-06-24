import { Lock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContinueToReadCard() {
  return (
    <Card className="w-xl mx-auto mt-4 border-0 bg-zinc-900 text-center">
      <CardContent className="flex flex-col items-center px-7 py-8">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25">
          <Lock className="h-4 w-4 text-zinc-300" />
        </div>

        <h2 className="font-serif text-[19px] font-medium text-zinc-100">
          This article is for subscribers
        </h2>

        <p className="mt-2 max-w-90 text-[13px] leading-relaxed text-zinc-400">
          Unlock every article, the full archive, and the discussion below.
        </p>

        <Button
          asChild
          className="mt-5 rounded-md bg-zinc-100 px-6  font-medium text-zinc-900 hover:bg-zinc-200"
        >
          <Link href="/subscriptions">Subscribe to unlock</Link>
        </Button>

        <p className="mt-3 text-[12.5px] text-zinc-500">
          Subscriber?{" "}
          <Link href="/sign-in" className="text-zinc-100 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}