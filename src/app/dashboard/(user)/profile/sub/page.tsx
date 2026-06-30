import { getPlanByName } from "@/_actions/subscription-actions";
import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import SubscriptionInfo from "./_components/subscription-info";
import SubscriptionHistory from "./_components/subscription-history";
import { formatPrice } from "@/lib/format-price";

export default async function SubscriptionPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const subscriptions = await auth.api.listActiveSubscriptions({ headers: await headers() });
    let latestSubscription;
    let price;
    if (subscriptions.length > 0) {
        latestSubscription = subscriptions[0];
        const plan = await getPlanByName(latestSubscription.plan);
        if (plan.success && plan.data) price = plan.data.price;
    }
    let history;
    if (subscriptions.length > 1) {
        history = subscriptions.slice(1);
    }
    // console.log(subscriptions);
    // console.log(latestSubscription);
    // console.log(subscriptions);
    // console.log(subscriptions.length);
    // console.log(latestSubscription, price);
    // const activeSubscription = subscription.find(
    //     (sub) => sub.status === "active" || sub.status === "trialing",
    // );
    if (subscriptions.length === 0) {
        return (
            <>
                <RouteHeading label="Subscription" />
                <div className="p-2">
                    <p>
                        You don&apos;t have an active subscription and never had. Check out our{" "}
                        <Link href="/subscriptions" className="underline">
                            subscription plans
                        </Link>{" "}
                        for a free trial.
                    </p>
                </div>
            </>
        );
    } else {
        if (latestSubscription && price) {
            return (
                <>
                    <RouteHeading label="Subscription" />
                    <div className="p-2">
                        <SubscriptionInfo
                            subscription={latestSubscription}
                            price={formatPrice(price)}
                            canceledAt={latestSubscription.cancelAt}
                        />
                    </div>
                    {history ? <SubscriptionHistory subscriptions={history} /> : ""}
                </>
            );
        }
    }
}
