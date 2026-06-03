"use server";

import { User, UserInfo } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { headers } from "next/headers";
import { z } from "zod";

const userInfoSchema = z.object({
    userId: z.string(),
    birthdate: z.iso.date("Invalid birthdate.").min(1, "Birthdate is required."),
    phone: z.string().min(5, "Phone number is required").max(15),
    country: z.string().min(1, "Country is required.").max(50),
    street: z.string().min(6, "Street address is required.").max(120),
    zip: z.string().min(5, "Zip code is required.").max(10),
    city: z.string().min(1, "City is required").max(50),
});

type userInfoValues = z.infer<typeof userInfoSchema>;

// A simple function for linking together the ids of UserInfo with the user id
// We do actually not use the normal id from the User table, but we use the id from
// the UserInfo table for running all queries, so we don't touch the better-auth stuffs.
// The function returns the correct user id if logged in, otherwise false.
export async function getUserId() {
    const user = await auth.api.getSession({ headers: await headers() });
    if (user) {
        const userInfo = await prisma.userInfo.findUnique({ where: { userId: user.user.id } });
        return userInfo?.id;
    } else {
        return false;
    }
}

export async function isEmailAddressUsed(emailAddress: string): Promise<Result<boolean>> {
    try {
        const user = await prisma.user.findUnique({ where: { email: emailAddress } });
        if (user) {
            return { success: true, data: true };
        } else {
            return { success: true, data: false };
        }
    } catch (err) {
        return {
            success: false,
            error: `Error when trying to read from the user table.\n\n${err}`,
        };
    }
}

export async function setUserInfo(values: userInfoValues) {
    try {
        const data = userInfoSchema.parse(values);
        const address = await prisma.address.create({
            data: {
                city: data.city,
                country: data.country,
                street: data.street,
                zip: data.zip,
            },
        });
        const userInfo = await prisma.userInfo.create({
            data: {
                address_id: address.id,
                birthdate: new Date(data.birthdate),
                phoneNumber: data.phone,
                role: "UNSUBSCRIBED",
                userId: data.userId,
            },
        });
        return { success: true, data: { data, userInfo, address } };
    } catch (err) {
        //console.log(`Didn't work: ${err}`);
        return { success: false, error: `Couldn't set user info.\n\n${err}` };
    }
}

export async function getAllUserDataFromId(userId: string) {
    const userInfoTable = await prisma.userInfo.findUnique({ where: { id: userId } });
    if (userInfoTable) {
        const user = await prisma.user.findUnique({ where: { id: userInfoTable.userId } });
        if (user) {
            return { success: true, data: [user, userInfoTable] };
        }
        return { success: false, error: `Couldn't find data for user with id ${userId}.` };
    } else {
        console.error(`Couldn't find user with id ${userId}.`);
        return { success: false, error: `Couldn't find user with id ${userId}.` };
    }
}
