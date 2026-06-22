"use client";

import { useState } from "react";
import { Advertisement, toggleAdvertisement, deleteAdvertisement } from "@/_actions/advertisement-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FORMAT_LABELS: Record<string, string> = {
    "banner":     "Banner 970×250",
    "sidebar":    "Sidebar 300×600",
    "in-article": "In-article 728×90",
    "newsletter": "Newsletter 600×200",
    "sponsored":  "Sponsored article",
};

export default function AdList({ ads }: { ads: Advertisement[] }) {
    const router = useRouter();
    const [busy, setBusy] = useState<string | null>(null);

    const toggle = async (ad: Advertisement) => {
        setBusy(ad.id);
        const res = await toggleAdvertisement(ad.id, !ad.active);
        setBusy(null);
        if (res.success) {
            toast.success(res.data!.active ? "Ad activated." : "Ad deactivated.");
            router.refresh();
        } else {
            toast.error(res.error ?? "Failed to update.");
        }
    };

    const remove = async (ad: Advertisement) => {
        if (!confirm(`Delete "${ad.label}"?`)) return;
        setBusy(ad.id);
        const res = await deleteAdvertisement(ad.id);
        setBusy(null);
        if (res.success) {
            toast.success("Ad deleted.");
            router.refresh();
        } else {
            toast.error(res.error ?? "Failed to delete.");
        }
    };

    if (ads.length === 0) {
        return <p className="text-sm text-muted-foreground">No advertisements yet.</p>;
    }

    return (
        <div className="space-y-3">
            {ads.map(ad => (
                <div
                    key={ad.id}
                    className="rounded-xl border p-4 bg-popover shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
                >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-14 rounded overflow-hidden bg-muted shrink-0">
                        <Image src={ad.imageUrl} alt={ad.label} fill className="object-contain" unoptimized />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{ad.label}</p>
                        <p className="text-xs text-muted-foreground">{FORMAT_LABELS[ad.format] ?? ad.format}</p>
                        {(ad.startsAt || ad.endsAt) && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {ad.startsAt ? new Date(ad.startsAt).toLocaleDateString("sv-SE") : "—"}
                                {" → "}
                                {ad.endsAt ? new Date(ad.endsAt).toLocaleDateString("sv-SE") : "ongoing"}
                            </p>
                        )}
                        <a
                            href={ad.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline truncate block mt-0.5"
                        >
                            {ad.linkUrl}
                        </a>
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        ad.active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                        {ad.active ? "Active" : "Inactive"}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                        <Button
                            size="sm"
                            variant={ad.active ? "outline" : "default"}
                            disabled={busy === ad.id}
                            onClick={() => toggle(ad)}
                        >
                            {ad.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            disabled={busy === ad.id}
                            onClick={() => remove(ad)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
