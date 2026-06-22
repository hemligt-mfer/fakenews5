"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

export type Advertisement = {
    id: string;
    createdAt: Date;
    label: string;
    format: string;
    imageUrl: string;
    linkUrl: string;
    active: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
};

export const AD_FORMATS = [
    { value: "banner",      label: "Banner (970×250)",        size: "970 × 250 px" },
    { value: "sidebar",     label: "Sidebar (300×600)",        size: "300 × 600 px" },
    { value: "in-article",  label: "In-article (728×90)",      size: "728 × 90 px"  },
    { value: "newsletter",  label: "Newsletter (600×200)",     size: "600 × 200 px" },
    { value: "sponsored",   label: "Sponsored article",        size: "—"            },
] as const;

export async function getActiveAd(format: string): Promise<Advertisement | null> {
    try {
        const now = new Date();
        const ads = await prisma.advertisement.findMany({
            where: {
                format,
                active: true,
                OR: [{ startsAt: null }, { startsAt: { lte: now } }],
                AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
            },
        });
        if (ads.length === 0) return null;
        return ads[Math.floor(Math.random() * ads.length)];
    } catch {
        return null;
    }
}

export async function getAdvertisements(): Promise<Result<Advertisement[]>> {
    try {
        const ads = await prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
        return { success: true, data: ads };
    } catch (err) {
        return { success: false, error: `${err}` };
    }
}

type AdInput = {
    label: string;
    format: string;
    imageUrl: string;
    linkUrl: string;
    active?: boolean;
    startsAt?: Date | null;
    endsAt?: Date | null;
};

export async function createAdvertisement(data: AdInput): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.create({ data });
        return { success: true, data: ad };
    } catch (err) {
        return { success: false, error: `${err}` };
    }
}

export async function updateAdvertisement(id: string, data: Partial<AdInput>): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.update({ where: { id }, data });
        return { success: true, data: ad };
    } catch (err) {
        return { success: false, error: `${err}` };
    }
}

export async function toggleAdvertisement(id: string, active: boolean): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.update({ where: { id }, data: { active } });
        return { success: true, data: ad };
    } catch (err) {
        return { success: false, error: `${err}` };
    }
}

export async function deleteAdvertisement(id: string): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.delete({ where: { id } });
        return { success: true, data: ad };
    } catch (err) {
        return { success: false, error: `${err}` };
    }
}
