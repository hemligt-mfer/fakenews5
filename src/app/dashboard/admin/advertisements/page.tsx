import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdvertisements } from "@/lib/ad-queries";
import RouteHeading from "@/components/route-heading";
import CreateAdForm from "./_components/create-ad-form";
import AdList from "./_components/ad-list";

export default async function AdvertisementsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") redirect("/");

    const res = await getAdvertisements();
    const ads = res.success && res.data ? res.data : [];

    return (
        <div className="w-full p-6 space-y-8">
            <RouteHeading label="Display Advertisements" />

            <CreateAdForm />

            <div>
                <h2 className="font-serif font-bold text-lg mb-4">All advertisements</h2>
                <AdList ads={ads} />
            </div>
        </div>
    );
}
