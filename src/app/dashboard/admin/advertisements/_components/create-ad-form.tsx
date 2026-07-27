"use client";

import { useState } from "react";
import { createAdvertisement } from "@/_actions/advertisement-actions";
import { AD_FORMATS } from "@/lib/ad-formats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload-action";
import Image from "next/image";

export default function CreateAdForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [fields, setFields] = useState({
        label: "",
        format: "banner",
        imageUrl: "",
        linkUrl: "",
        startsAt: "",
        endsAt: "",
        placement: "both",
    });

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadImage(fd);
        if ("error" in result) {
            toast.error(result.error, { position: "top-center" });
            setFields(f => ({ ...f, imageUrl: "" }));
        } else {
            setFields(f => ({ ...f, imageUrl: result.url }));
        }
        setImageUploading(false);
    };

    const set = (key: keyof typeof fields) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setFields(f => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fields.label || !fields.imageUrl || !fields.linkUrl) {
            toast.error("Label, image URL and link URL are required.");
            return;
        }
        setLoading(true);
        try {
            const res = await createAdvertisement({
                label: fields.label,
                format: fields.format,
                imageUrl: fields.imageUrl,
                linkUrl: fields.linkUrl,
                active: false,
                startsAt: fields.startsAt ? new Date(fields.startsAt) : null,
                endsAt: fields.endsAt ? new Date(fields.endsAt) : null,
                placement: fields.format === "banner" ? fields.placement : "both",
            });
            if (res.success) {
                toast.success("Ad created — remember to activate it.");
                setFields({ label: "", format: "banner", imageUrl: "", linkUrl: "", startsAt: "", endsAt: "", placement: "both" });
                router.refresh();
            } else {
                toast.error(res.error ?? "Failed to create ad.");
            }
        } catch (err) {
            toast.error(`Unexpected error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border p-5 bg-popover shadow-sm space-y-4">
            <h2 className="font-bold text-lg">Add new advertisement</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Label (internal name)
                    </label>
                    <Input placeholder="e.g. Volvo Q3 Campaign" value={fields.label} onChange={set("label")} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Format
                    </label>
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

                {fields.format === "banner" && (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Placement
                        </label>
                        <select
                            value={fields.placement}
                            onChange={set("placement")}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="both">Top &amp; bottom</option>
                            <option value="top">Top only</option>
                            <option value="bottom">Bottom only</option>
                        </select>
                    </div>
                )}

                <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Image
                    </label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={imageUploading}
                    />
                    {imageUploading && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Spinner className="size-4" />
                            Uploading...
                        </div>
                    )}
                    {fields.imageUrl && !imageUploading && (
                        <Image
                            src={fields.imageUrl}
                            alt="Ad image preview"
                            width={300}
                            height={100}
                            className="mt-2 h-20 w-auto rounded object-contain border"
                        />
                    )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Destination URL (where clicking the ad goes)
                    </label>
                    <Input placeholder="https://advertiser.com" value={fields.linkUrl} onChange={set("linkUrl")} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Start date (optional)
                    </label>
                    <Input type="date" value={fields.startsAt} onChange={set("startsAt")} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        End date (optional)
                    </label>
                    <Input type="date" value={fields.endsAt} onChange={set("endsAt")} />
                </div>
            </div>

            <Button type="submit" disabled={loading || imageUploading}>
                {loading ? <Spinner /> : "Create ad (inactive)"}
            </Button>
        </form>
    );
}
