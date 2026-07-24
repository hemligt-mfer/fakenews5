import { getActiveAd } from "@/lib/ad-queries";
import Image from "next/image";

type Props = {
    slot?: "top" | "bottom";
};

export default async function AdBanner({ slot }: Props) {
    const ad = await getActiveAd("banner", slot);

    return (
        <div className="w-full bg-background border-y  py-3 px-4 flex flex-col items-center gap-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400">
                Advertisement
            </p>
            {ad ? (
                <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-4xl"
                >
                    <div className="relative w-full max-w-4xl h-[100px]">
                        <Image
                            src={ad.imageUrl}
                            alt={ad.label}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </a>
            ) : (
                <div className="w-full max-w-4xl h-20 rounded bg-background flex items-center justify-center">
                    <span className="text-xs text-gray-400 italic">
                        Your ad could be here
                    </span>
                </div>
            )}
        </div>
    );
}
