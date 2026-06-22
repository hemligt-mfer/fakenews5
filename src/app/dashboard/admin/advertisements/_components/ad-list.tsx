"use client";

import { useState } from "react";
import { Advertisement, toggleAdvertisement, deleteAdvertisement, updateAdvertisement } from "@/_actions/advertisement-actions";
import { AD_FORMATS } from "@/lib/ad-formats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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

type EditFields = {
    label: string;
    format: string;
    imageUrl: string;
    linkUrl: string;
    startsAt: string;
    endsAt: string;
};

function toDateInput(d: Date | null): string {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 10);
}

function EditForm({ ad, onDone }: { ad: Advertisement; onDone: () => void }) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [fields, setFields] = useState<EditFields>({
        label: ad.label,
        format: ad.format,
        imageUrl: ad.imageUrl,
        linkUrl: ad.linkUrl,
        startsAt: toDateInput(ad.startsAt),
        endsAt: toDateInput(ad.endsAt),
    });

    const set = (key: keyof EditFields) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setFields(f => ({ ...f, [key]: e.target.value }));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fields.label || !fields.imageUrl || !fields.linkUrl) {
            toast.error("Label, image URL and link URL are required.");
            return;
        }
        setSaving(true);
        try {
            const res = await updateAdvertisement(ad.id, {
                label: fields.label,
                format: fields.format,
                imageUrl: fields.imageUrl,
                linkUrl: fields.linkUrl,
                startsAt: fields.startsAt ? new Date(fields.startsAt) : null,
                endsAt: fields.endsAt ? new Date(fields.endsAt) : null,
            });
            if (res.success) {
                toast.success("Ad updated.");
                router.refresh();
                onDone();
            } else {
                toast.error(res.error ?? "Failed to save.");
            }
        } catch (err) {
            toast.error(`Unexpected error: ${err}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Label</label>
                    <Input value={fields.label} onChange={set("label")} placeholder="Internal name" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Format</label>
                    <select
                        value={fields.format}
                        onChange={set("format")}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        {AD_FORMATS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Image URL</label>
                    <Input value={fields.imageUrl} onChange={set("imageUrl")} placeholder="https://…" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destination URL</label>
                    <Input value={fields.linkUrl} onChange={set("linkUrl")} placeholder="https://…" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start date (optional)</label>
                    <Input type="date" value={fields.startsAt} onChange={set("startsAt")} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">End date (optional)</label>
                    <Input type="date" value={fields.endsAt} onChange={set("endsAt")} />
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={saving}>
                    {saving ? <Spinner /> : "Save changes"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={onDone} disabled={saving}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

export default function AdList({ ads }: { ads: Advertisement[] }) {
    const router = useRouter();
    const [busy, setBusy] = useState<string | null>(null);
    const [editing, setEditing] = useState<string | null>(null);

    const toggle = async (ad: Advertisement) => {
        setBusy(ad.id);
        try {
            const res = await toggleAdvertisement(ad.id, !ad.active);
            if (res.success) {
                toast.success(res.data!.active ? "Ad activated." : "Ad deactivated.");
                router.refresh();
            } else {
                toast.error(res.error ?? "Failed to update.");
            }
        } finally {
            setBusy(null);
        }
    };

    const remove = async (ad: Advertisement) => {
        if (!confirm(`Delete "${ad.label}"?`)) return;
        setBusy(ad.id);
        try {
            const res = await deleteAdvertisement(ad.id);
            if (res.success) {
                toast.success("Ad deleted.");
                router.refresh();
            } else {
                toast.error(res.error ?? "Failed to delete.");
            }
        } finally {
            setBusy(null);
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
                    className="rounded-xl border p-4 bg-popover shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                                variant="outline"
                                disabled={busy === ad.id}
                                onClick={() => setEditing(editing === ad.id ? null : ad.id)}
                            >
                                {editing === ad.id ? "Close" : "Edit"}
                            </Button>
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

                    {editing === ad.id && (
                        <EditForm ad={ad} onDone={() => setEditing(null)} />
                    )}
                </div>
            ))}
        </div>
    );
}
