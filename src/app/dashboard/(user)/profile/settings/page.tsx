import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import EditProfileForm from "../_components/edit-profile-form";
import PasswordGate from "../_components/password-gate";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;


    const userInfo = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            user_info: {
                select: {
                    birthdate: true,
                    phoneNumber: true,
                    address: {
                        select: { city: true, country: true, street: true, zip: true },
                    },
                    bookmark: { select: { article: { select: { category: true } } } },
                },
            },
            author: true,
            accounts: { select: { password: true } },
        },
    });

    if (!userInfo) {
        notFound();
    }

    return (
        <div suppressContentEditableWarning suppressHydrationWarning>
            <RouteHeading label="User settings" />
            <div className="">
                <div className="m-6">
                    <PasswordGate>
                    <EditProfileForm user={userInfo} />
                    </PasswordGate>
                </div>
            </div>
        </div>
    );
}
