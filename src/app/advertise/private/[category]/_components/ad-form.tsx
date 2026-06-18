"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitAd } from "../_actions/submit-ad";
import { CheckCircle2, ImagePlus, X } from "lucide-react";

const CONDITIONS = [
    { value: "new",       label: "New" },
    { value: "like-new",  label: "Like new" },
    { value: "good",      label: "Good" },
    { value: "fair",      label: "Fair" },
    { value: "for-parts", label: "For parts / not working" },
    { value: "n-a",       label: "Not applicable" },
];

const PRICE_TYPES = [
    { value: "fixed",      label: "Fixed price" },
    { value: "negotiable", label: "Negotiable" },
    { value: "free",       label: "Free" },
    { value: "contact",    label: "Contact for price" },
];

const TIERS = [
    { value: "basic",    label: "Basic — Free",     desc: "1 photo · 30 days · Standard placement" },
    { value: "plus",     label: "Plus — 49 kr",     desc: "5 photos · 60 days · Highlighted" },
    { value: "featured", label: "Featured — 99 kr", desc: "10 photos · 60 days · Top placement + front page" },
];

const MAX_PHOTOS: Record<string, number> = { basic: 1, plus: 5, featured: 10 };
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Props = {
    categorySlug: string;
    subcategories: string[];
    titlePlaceholder: string;
};

const EMPTY_FIELDS = {
    listingType:  "sell" as const,
    subcategory:  "",
    title:        "",
    description:  "",
    price:        "",
    priceType:    "fixed" as const,
    condition:    "good" as const,
    location:     "",
    contactName:  "",
    contactEmail: "",
    contactPhone: "",
    tier:         "basic" as const,
};

export default function AdForm({ categorySlug, subcategories, titlePlaceholder }: Props) {
    const [pending, startTransition] = useTransition();
    const [done, setDone]           = useState(false);
    const [error, setError]         = useState<string | null>(null);
    const [fields, setFields]       = useState(EMPTY_FIELDS);
    const [photos, setPhotos]       = useState<File[]>([]);
    const [previews, setPreviews]   = useState<string[]>([]);
    const [listingTypePicked, setListingTypePicked] = useState(false);
    const fileInputRef              = useRef<HTMLInputElement>(null);

    const maxPhotos = MAX_PHOTOS[fields.tier] ?? 1;

    // Trim photos when tier is downgraded
    useEffect(() => {
        const max = MAX_PHOTOS[fields.tier] ?? 1;
        setPhotos(prev => {
            if (prev.length <= max) return prev;
            return prev.slice(0, max);
        });
        setPreviews(prev => {
            if (prev.length <= max) return prev;
            prev.slice(max).forEach(url => URL.revokeObjectURL(url));
            return prev.slice(0, max);
        });
    }, [fields.tier]);

    const set =
        (key: keyof typeof fields) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setFields(f => ({ ...f, [key]: e.target.value }));

    const addPhotos = (fileList: FileList | null) => {
        if (!fileList) return;
        const candidates = Array.from(fileList).filter(f => ALLOWED_TYPES.includes(f.type));
        const slots = maxPhotos - photos.length;
        if (slots <= 0) return;
        const incoming = candidates.slice(0, slots);
        const newPreviews = incoming.map(f => URL.createObjectURL(f));
        setPhotos(prev => [...prev, ...incoming]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePhoto = (i: number) => {
        URL.revokeObjectURL(previews[i]);
        setPhotos(prev => prev.filter((_, idx) => idx !== i));
        setPreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        addPhotos(e.dataTransfer.files);
    };

    const reset = () => {
        previews.forEach(url => URL.revokeObjectURL(url));
        setPhotos([]);
        setPreviews([]);
        setFields(EMPTY_FIELDS);
        setListingTypePicked(false);
        setDone(false);
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            let photoUrls: string[] = [];

            if (photos.length > 0) {
                const fd = new FormData();
                photos.forEach(p => fd.append("photos", p));
                const res = await fetch("/uploads/ad-photos", { method: "POST", body: fd });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    setError(body.error ?? "Photo upload failed. Please try again.");
                    return;
                }
                const data = await res.json();
                photoUrls = data.urls as string[];
            }

            const result = await submitAd({ ...fields, listingType: fields.listingType, category: categorySlug, photos: photoUrls });

            if ("checkoutUrl" in result && result.checkoutUrl) {
                window.location.href = result.checkoutUrl;
                return;
            }
            if (result.success) {
                setDone(true);
            } else {
                setError(result.error ?? "Something went wrong. Please try again.");
            }
        });
    };

    /* ── Success screen ── */
    if (done) {
        return (
            <div className="rounded-xl border p-8 bg-popover shadow-sm text-center space-y-3">
                <CheckCircle2 size={40} className="text-primary mx-auto" />
                <h2 className="font-serif text-2xl font-bold">Ad submitted!</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We&apos;ll review your ad and publish it within one business day. You&apos;ll
                    receive a confirmation at the email address you provided.
                </p>
                <Button variant="outline" onClick={reset}>Place another ad</Button>
            </div>
        );
    }

    /* ── Form ── */
    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Listing type */}
            <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    I want to…
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: "sell", label: "Sell / Give away" },
                        { value: "wanted", label: "Buy / Looking for" },
                    ].map(opt => (
                        <label
                            key={opt.value}
                            className={`rounded-xl border p-3 cursor-pointer text-center transition-colors text-sm font-semibold ${
                                listingTypePicked && fields.listingType === opt.value
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "bg-popover hover:border-primary hover:bg-primary/5 hover:text-primary"
                            }`}
                        >
                            <input
                                type="radio"
                                name="listingType"
                                value={opt.value}
                                checked={fields.listingType === opt.value}
                                onChange={(e) => { setListingTypePicked(true); set("listingType")(e); }}
                                className="sr-only"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Subcategory */}
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subcategory <span className="text-destructive">*</span>
                </label>
                <select
                    required
                    value={fields.subcategory}
                    onChange={set("subcategory")}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                >
                    <option value="">— select subcategory —</option>
                    {subcategories.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Title */}
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Title <span className="text-destructive">*</span>
                </label>
                <Input
                    required
                    maxLength={100}
                    placeholder={titlePlaceholder}
                    value={fields.title}
                    onChange={set("title")}
                />
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                    required
                    maxLength={1500}
                    rows={5}
                    placeholder="Describe the item — condition, age, reason for selling, any defects..."
                    value={fields.description}
                    onChange={set("description")}
                />
                <p className="text-xs text-muted-foreground text-right">
                    {fields.description.length} / 1500
                </p>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {fields.listingType === "wanted" ? "Budget (kr)" : "Price (kr)"}
                    </label>
                    <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={fields.price}
                        onChange={set("price")}
                        disabled={fields.priceType === "free" || fields.priceType === "contact"}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Price type
                    </label>
                    <select
                        value={fields.priceType}
                        onChange={set("priceType")}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    >
                        {PRICE_TYPES.map(pt => (
                            <option key={pt.value} value={pt.value}>{pt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Condition + Location */}
            <div className="grid grid-cols-2 gap-4">
                {fields.listingType === "sell" && (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Condition
                        </label>
                        <select
                            value={fields.condition}
                            onChange={set("condition")}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        >
                            {CONDITIONS.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className={`space-y-1 ${fields.listingType === "wanted" ? "col-span-2" : ""}`}>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Location <span className="text-destructive">*</span>
                    </label>
                    <Input
                        required
                        placeholder="e.g. Linköping"
                        value={fields.location}
                        onChange={set("location")}
                    />
                </div>
            </div>

            {/* Contact */}
            <div className="rounded-xl border p-4 space-y-3 bg-muted/30">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Your contact details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                            Name <span className="text-destructive">*</span>
                        </label>
                        <Input required placeholder="Your name" value={fields.contactName} onChange={set("contactName")} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                            Email <span className="text-destructive">*</span>
                        </label>
                        <Input required type="email" placeholder="you@email.com" value={fields.contactEmail} onChange={set("contactEmail")} />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs text-muted-foreground">Phone (optional)</label>
                        <Input type="tel" placeholder="+46 70 000 00 00" value={fields.contactPhone} onChange={set("contactPhone")} />
                    </div>
                </div>
            </div>

            {/* Tier */}
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ad tier
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                    {TIERS.map(t => (
                        <label
                            key={t.value}
                            className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                                fields.tier === t.value
                                    ? "border-primary bg-primary/5"
                                    : "bg-popover hover:border-muted-foreground"
                            }`}
                        >
                            <input
                                type="radio"
                                name="tier"
                                value={t.value}
                                checked={fields.tier === t.value}
                                onChange={set("tier")}
                                className="sr-only"
                            />
                            <p className="font-semibold text-sm">{t.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                        </label>
                    ))}
                </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Photos
                    </p>
                    <span className="text-xs text-muted-foreground">
                        {photos.length} / {maxPhotos}
                    </span>
                </div>

                {/* Thumbnails */}
                {previews.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {previews.map((src, i) => (
                            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove photo"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Drop zone */}
                {photos.length < maxPhotos && (
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                        <ImagePlus size={22} />
                        <p className="text-xs text-center">
                            Click or drag photos here<br />
                            <span className="text-[11px]">JPEG, PNG, WebP, GIF · max 5 MB each</span>
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple
                            className="sr-only"
                            onChange={e => addPhotos(e.target.files)}
                        />
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
                {pending
                    ? fields.tier === "basic" ? "Submitting…" : "Preparing payment…"
                    : fields.tier === "basic" ? "Submit ad" : `Pay & submit — ${fields.tier === "plus" ? "49 kr" : "99 kr"}`
                }
            </Button>
        </form>
    );
}
