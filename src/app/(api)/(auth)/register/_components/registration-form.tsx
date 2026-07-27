"use client";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput, CountryData } from "@/components/phone-input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Country, CountryDropdown } from "@/components/country-dropdown";
import Button from "@/components/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { isEmailAddressUsed, setUserInfo } from "@/_actions/user-actions";
import { toast } from "sonner";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { uploadImage } from "@/lib/upload-action";

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
        image: z.string(),
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
    const [visible, setVisible] = useState({
        password: false,
        confirmPassword: false,
    });
    const [countryData, setCountryData] = useState<CountryData>();
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
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
            image: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const emailInUse = await isEmailAddressUsed(value.email);
            if (emailInUse.success && emailInUse.data == true) {
                toast.error(`Email address ${value.email} is already in use.`, {
                    position: "top-center",
                });
            } else {
                let imageUrl = "";
                if (imageFile) {
                    const fd = new FormData();
                    fd.append("file", imageFile);
                    const uploadResult = await uploadImage(fd);
                    if ("error" in uploadResult) {
                        toast.error(uploadResult.error, { position: "top-center" });
                        setLoading(false);
                        return; // stop submission, don't create the article
                    }
                    imageUrl = uploadResult.url;
                }
                const { data, error } = await authClient.signUp.email({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    image: imageUrl,
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
                            { position: "top-center" },
                        );
                    }
                } else {
                    toast.error(`An error occurred while trying to register.\n\n${error}`, {
                        position: "top-center",
                    });
                }
            }
            setLoading(false);
        },
    });

    return (
        <Card className="max-w-2xl mx-auto mt-13">
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
                                        <InputGroup className="w-full ">
                                            <Input
                                                className="rounded-r-none"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(ev) =>
                                                    field.handleChange(ev.target.value)
                                                }
                                                placeholder="Enter password"
                                                type={visible.password ? "text" : "password"}
                                                autoComplete="current-password"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    aria-label="Toggle visibility"
                                                    onClick={() =>
                                                        setVisible((v) => ({
                                                            ...v,
                                                            password: !v.password,
                                                        }))
                                                    }
                                                    size="icon-xs"
                                                    variant="ghost"
                                                >
                                                    {visible.password ? (
                                                        <EyeIcon />
                                                    ) : (
                                                        <EyeOffIcon />
                                                    )}
                                                </InputGroupButton>
                                            </InputGroupAddon>
                                        </InputGroup>

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
                                            Confirm Password
                                        </FieldLabel>
                                        <InputGroup className="w-full ">
                                            <Input
                                                className="rounded-r-none"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(ev) =>
                                                    field.handleChange(ev.target.value)
                                                }
                                                placeholder="Enter password"
                                                type={visible.confirmPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    aria-label="Toggle visibility"
                                                    onClick={() =>
                                                        setVisible((v) => ({
                                                            ...v,
                                                            confirmPassword: !v.confirmPassword,
                                                        }))
                                                    }
                                                    size="icon-xs"
                                                    variant="ghost"
                                                >
                                                    {visible.confirmPassword ? (
                                                        <EyeIcon />
                                                    ) : (
                                                        <EyeOffIcon />
                                                    )}
                                                </InputGroupButton>
                                            </InputGroupAddon>
                                        </InputGroup>

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
                        <form.Field name="image">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                const handleFileChange = (
                                    ev: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const file = ev.target.files?.[0];
                                    if (!file) return;

                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));

                                    field.handleChange(file.name);
                                    field.handleBlur();
                                };

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="border-r border-b"
                                            id={field.name}
                                            name={field.name}
                                            onChange={handleFileChange}
                                            aria-invalid={isInvalid}
                                        />

                                        {imagePreview && (
                                            <div>
                                                <img
                                                    src={imagePreview}
                                                    alt="Current avatar"
                                                    width={50}
                                                    height={50}
                                                    className="mt-2 mx-auto h-50 w-50 rounded object-cover border"
                                                />
                                            </div>
                                        )}

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
                <Button form="register-form" type="reset" size="lg" onClick={() => form.reset()} className="cursor-pointer">
                    Reset
                </Button>
                <Button form="register-form" type="submit" size="lg" disabled={loading} className="cursor-pointer">
                    {loading ? <Spinner /> : "Submit"}
                </Button>
            </CardFooter>
        </Card>
    );
}
