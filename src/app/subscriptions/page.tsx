export const dynamic = "force-dynamic";

import { getPlans, getStripeSubscriptionIdForUser } from "@/_actions/subscription-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SubCard from "./_components/sub-card";
import { getActiveSubscriptionsPriceId } from "@/lib/require-sub";
import RouteHeading from "@/components/route-heading";

export default async function SubscriptionsPage() {
    const plans = await getPlans();
    const session = await auth.api.getSession({ headers: await headers() });
    let subscriptionIdForUser: string | undefined;
    let subPriceId: string | undefined;
    if (session?.user.id) {
        const res = await getStripeSubscriptionIdForUser(session?.user.id);
        if (res.success && res.data) {
            subscriptionIdForUser = res.data;
        }
        subPriceId = await getActiveSubscriptionsPriceId();
    }

    if (plans.success && plans.data && plans.data.length >= 1) {
        return (
            <div className="">
                <RouteHeading label="Subscriptions" />
                <h1 className="text-xl md:text-2xl mt-5 font-extrabold text-center">
                    Subscription plans
                </h1>
                <p className="mx-5 text-center ">
                    Below you can find the various subscription plans that we offer. In order to
                    subscribe to our news site, you need to first register an account.
                </p>
                <div className="mx-10 mt-5">
                    <ul>
                        {plans.data.map((p, i) => {
                            return (
                                <li key={p.id}>
                                    <SubCard
                                        plan={p}
                                        loggedIn={session ? true : false}
                                        userSubId={subscriptionIdForUser}
                                        userSubPriceId={subPriceId}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-2">
                <p>There are no subscription plans in the database.</p>
            </div>
        );
    }
}
