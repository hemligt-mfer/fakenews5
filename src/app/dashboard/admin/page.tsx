import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/");
    }

    const userId = session.user.id;

    const hasPermission = await auth.api.userHasPermission({
        body: {
            userId: userId,
            permissions: {
                article: ["create", "update", "delete"],
            },
        },
    });

    if (!hasPermission.success) {
        redirect("/");
    }

    return (
        <div>
            <RouteHeading label="Admin dashboard" />
        </div>
    );
}
