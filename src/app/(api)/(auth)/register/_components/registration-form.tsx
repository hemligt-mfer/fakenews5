"use client";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput, phoneSchema, CountryData } from "@/components/phone-input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Country, CountryDropdown } from "@/components/country-dropdown";
import Button from "@/components/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { isEmailAddressUsed, setUserInfo } from "@/_actions/user-actions";
import { toast } from "sonner";

const formSchema = z
    .object({
        name: z.string().min(1, "Name is required.").max(64),
        email: z
            .email("Invalid email address.")
            .min(6, "Email address must be at least six characters.")
            .max(64),
        password: z.string().min(8, "Password must be at least eight characters."),
        confirmPassword: z.string().min(8, "Password must be at least eight characters."),
        birthdate: z.iso.date("Invalid birthdate.").min(1, "Birthdate is required."),
        street: z.string().min(6, "Street address is required.").max(120),
        zip: z.string().min(5, "Zip code is required.").max(10),
        city: z.string().min(1, "City is required").max(50),
        country: z.string().min(1, "Country is required.").max(50),
        phone: z.string().min(5, "Phone number is required").max(15),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match.",
                path: ["confirmPassword"],
            });
        }
    });

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [countryData, setCountryData] = useState<CountryData>();
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            birthdate: "",
            street: "",
            zip: "",
            city: "",
            country: "",
            phone: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const emailInUse = await isEmailAddressUsed(value.email);
            if (emailInUse.success && emailInUse.data == true) {
                toast.error(`Email address ${value.email} is already in use.`);
            } else {
                const { data, error } = await authClient.signUp.email({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                });
                if (data && error == null) {
                    const userInfo = await setUserInfo({
                        userId: data.user.id,
                        birthdate: value.birthdate,
                        phone: value.phone,
                        country: value.country,
                        street: value.street,
                        zip: value.zip,
                        city: value.city,
                    });
                    if (userInfo.success) {
                        router.push("/verify");
                    } else {
                        toast.error(
                            `An error occurred while trying to register.\n\n${userInfo.data}`,
                        );
                    }
                } else {
                    toast.error(`An error occurred while trying to register.\n\n${error}`);
                }
            }
            setLoading(false);
        },
    });

    return (
        <Card className="w-2xl">
            <CardHeader>
                <CardTitle>Create a new account</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id="register-form"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="name"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>
                        <form.Field name="email">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="email"
                                            type="email"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="password">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="new-password"
                                            type="password"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="confirmPassword">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Confirm password
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="new-password"
                                            type="password"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="birthdate">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Birth date</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="bday"
                                            type="date"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="country">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                                        <CountryDropdown
                                            onChange={(country) => {
                                                setSelectedCountry(country);
                                                setCountryData(country);
                                                const countryCode = country.countryCallingCodes[0];
                                                const formattedCode = countryCode.startsWith("+")
                                                    ? countryCode
                                                    : `+${countryCode}`;
                                                field.setValue(country.name);
                                                form.setFieldValue("phone", formattedCode);
                                            }}
                                            defaultValue={selectedCountry?.alpha3}
                                        />
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="phone">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Phone number</FieldLabel>
                                        <PhoneInput
                                            value={field.state.value}
                                            placeholder="Enter your number"
                                            defaultCountry={selectedCountry?.alpha2}
                                            onCountryChange={(country) => {
                                                setCountryData(country);
                                                setSelectedCountry(country as Country);
                                            }}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                        />
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="street">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="billing street-address"
                                            type="text"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="zip">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Zip</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="billing postal-code"
                                            type="text"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="city">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>City</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="address-level2"
                                            type="text"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button form="register-form" type="reset" size="lg" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button form="register-form" type="submit" size="lg" disabled={loading}>
                    {loading ? <Spinner /> : "Submit"}
                </Button>
            </CardFooter>
        </Card>
    );
}
