import { getPlans } from "@/_actions/subscription-actions";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";
import { columns } from "./_components/columns";
import CreatePlanForm from "./_components/create-plan-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
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
    const res = await getPlans();
    let plans;
    if (res.success && res.data) {
        plans = res.data;
        return (
            <div className="p-2">
                <RouteHeading label="Subscriptions" />
                <DataTable columns={columns} data={plans} />
                <div className="flex justify-center mb-4">
                    <CreatePlanForm />
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-2">
                <RouteHeading label="Subscriptions" />
                <p>No subscription plans in the database.</p>
                <div className="flex justify-center mb-4">
                    <CreatePlanForm />
                </div>
            </div>
        );
    }
}
