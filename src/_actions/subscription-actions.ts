"use server";

import prisma from "@/lib/prisma";
import { Result, Plan } from "@/lib/types";

export async function getPlans(): Promise<Result<Plan[]>> {
  try {
    const plans = await prisma.plan.findMany();
    return { success: true, data: plans };
  } catch (err) {
    const msg = `Couldn't fetch the subscription plans from the database.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function getPlanByName(name: string) {
  try {
    const plan = await prisma.plan.findUnique({
      where: { name: name.toLowerCase() },
    });
    return { success: true, data: plan };
  } catch (err) {
    const msg = `Couldn't fetch subscription plan ${name}.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function getPlan(id: string): Promise<Result<Plan>> {
  try {
    const plan = await prisma.plan.findUnique({ where: { id: id } });
    if (plan) return { success: true, data: plan };
    else
      return {
        success: false,
        error: `Couldn't fetch plan with id ${id} from the database.`,
      };
  } catch (err) {
    const msg = `An error occurred when trying to fetch the plan with id ${id}.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

type PlanWithoutId = Omit<Plan, "id">;

export async function createPlan(plan: PlanWithoutId): Promise<Result<Plan>> {
  try {
    const res = await prisma.plan.create({
      data: {
        name: plan.name.toLowerCase(),
        description: plan.description,
        image: plan.image,
        price: plan.price,
        priceId: plan.priceId,
        annualPrice: plan.annualPrice,
        annualPriceId: plan.annualPriceId,
      },
    });
    if (res) return { success: true, data: res };
    else return { success: false, error: "Couldn't create new plan." };
  } catch (err) {
    const msg = `An unknown error occurred when trying to write a new subscription plan to the database.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function updatePlan(plan: Plan): Promise<Result<Plan>> {
  try {
    const res = await prisma.plan.update({
      data: {
        name: plan.name,
        description: plan.description,
        image: plan.image,
        price: plan.price,
        priceId: plan.priceId,
        annualPrice: plan.annualPrice,
        annualPriceId: plan.annualPriceId,
      },
      where: { id: plan.id },
    });
    if (res) return { success: true, data: res };
    else return { success: false, error: "Couldn't update plan." };
  } catch (err) {
    const msg = `Couldn't update plan with id ${plan.id}\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function deletePlan(id: string): Promise<Result<Plan>> {
  try {
    const res = await prisma.plan.delete({ where: { id: id } });
    return { success: true, data: res };
  } catch (err) {
    const msg = `Couldn't delete subscription plan ${id} from the database.\n\n${err}`;
    console.error(msg);
    return { success: false, error: msg };
  }
}

export async function getStripeSubscriptionIdForUser(
  userId: string,
): Promise<Result<string | undefined>> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.stripeCustomerId) {
      const sub = await prisma.subscription.findFirst({
        where: { stripeCustomerId: user?.stripeCustomerId },
      });
      if (sub?.stripeSubscriptionId)
        return { success: true, data: sub.stripeSubscriptionId };
      else return { success: true, data: undefined };
    } else {
      return { success: true, data: undefined };
    }
  } catch (err) {
    const msg = `Couldn't get subscription id for user ${userId}.`;
    console.error(msg);
    return { success: false, error: msg };
  }
}
