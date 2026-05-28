"use client";

import { z } from "better-auth";

const formSchema = z.object({
    name: z.string().min(1, "Name is required.").max(64),
    email: z.email().min(1, "Email is required.").max(64),
    password: z.string().min(8, "Password must be at least eight characters."),
    confirmPassword: z.string().min(8, "Password must be at least eight characters."),
    street: z.string().min(6, "Street address is required.").max(120),
    zip: z.string().min(5, "Zip code is required.").max(10),
    country: z.string().min(1, "Country is required.").max(100),
    birthdate: z.date(),
});
