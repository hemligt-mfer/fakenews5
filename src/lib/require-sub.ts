import { headers } from "next/headers"
import { auth } from "./auth"
import prisma from "./prisma"


const ACTIVE_STATUSES = ["active", "trialing"]

const plans = await prisma.plans.findMany({

})

type PlanName = (typeof plans)[number]["name"]

const isSubscriber = await requiureSubscription("basic")

{isSubscriber.authorized ? "true" : "false"}
{JSON.stringify(isSubscriber.subscription, null, 2)} // .(more displayable options)

// {isSubscriber.authorized ? (<>content for subs</>) : (<>Subscribe NOW component</>)} // conditionally render

export async function requiureSubscription(plan: PlanName){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        return { authorized: false, subscription: null} as const
    }
    const subscription = await auth.api.listActiveSubscriptions({
        headers: await headers(),
    })
    const match = subscription.find((sub) => sub.plan === plan && ACTIVE_STATUSES.includes(sub.status));

    return match ? ({ authorized: true, subscription: match} as const) : ({ authorized: false, subscription: null} as const)
}