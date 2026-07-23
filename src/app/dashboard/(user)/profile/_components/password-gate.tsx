"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { verifyPassword } from "../_actions/verify-password";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await verifyPassword(password);
      if (result.success) {
        setUnlocked(true);
      } else {
        setError(result.error ?? "Incorrect password");
      }
    });
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="max-w-sm space-y-4 rounded-lg border p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span className="text-sm">Confirm your password to continue</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="confirm-password">Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={isPending || !password}
          className="cursor-pointer"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </form>
    </div>
  );
}
