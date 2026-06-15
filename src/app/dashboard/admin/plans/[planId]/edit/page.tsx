import { getPlan } from "@/_actions/subscription-actions";
import EditPlanForm from "./_components/edit-plan-form";
import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditPlanPage({ params }: { params: Promise<{ planId: string }> }) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        redirect("/");
      }
      const hasPermission = await auth.api.userHasPermission({
        body: {
          userId: session?.user.id,
          permissions: {
            article: ["create", "update", "delete", "read"],
          },
        },
      });
      if (session.user.role !== "admin" && hasPermission.success) {
        redirect("/");
      }
    const { planId } = await params;
    const res = await getPlan(planId);
    if (res.success && res.data) {
        const plan = res.data;
        return (
            <div className="p-2">
                <RouteHeading label={`Edit subscription plan ${plan.name}`} />
                <div className="flex justify-center mt-4">
                    <EditPlanForm plan={plan} />
                </div>
            </div>
        );
    }
}
