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
        console.log(`[getActiveAd] format="${format}" found=${ads.length} now=${now.toISOString()}`);
        if (ads.length === 0) return null;
        return ads[Math.floor(Math.random() * ads.length)];
    } catch (err) {
        console.error(`[getActiveAd] format="${format}" ERROR:`, err);
        return null;
    }
}

export async function getAdvertisements(): Promise<Result<Advertisement[]>> {
    try {
        const ads = await prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
        return { success: true, data: ads };
    } catch (err) {
        console.error("[getAdvertisements]", err);
        return { success: false, error: `${err}` };
    }
}
