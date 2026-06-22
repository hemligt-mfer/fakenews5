"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { revalidatePath } from "next/cache";
import type { Advertisement } from "@/lib/ad-queries";

export type { Advertisement } from "@/lib/ad-queries";

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
        revalidatePath("/dashboard/admin/advertisements");
        return { success: true, data: ad };
    } catch (err) {
        console.error("[createAdvertisement]", err);
        return { success: false, error: `${err}` };
    }
}

export async function updateAdvertisement(id: string, data: Partial<AdInput>): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.update({ where: { id }, data });
        revalidatePath("/dashboard/admin/advertisements");
        return { success: true, data: ad };
    } catch (err) {
        console.error("[updateAdvertisement]", err);
        return { success: false, error: `${err}` };
    }
}

export async function toggleAdvertisement(id: string, active: boolean): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.update({ where: { id }, data: { active } });
        revalidatePath("/dashboard/admin/advertisements");
        return { success: true, data: ad };
    } catch (err) {
        console.error("[toggleAdvertisement]", err);
        return { success: false, error: `${err}` };
    }
}

export async function deleteAdvertisement(id: string): Promise<Result<Advertisement>> {
    try {
        const ad = await prisma.advertisement.delete({ where: { id } });
        revalidatePath("/dashboard/admin/advertisements");
        return { success: true, data: ad };
    } catch (err) {
        console.error("[deleteAdvertisement]", err);
        return { success: false, error: `${err}` };
    }
}
