"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
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
