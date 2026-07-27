"use client";
import { createPlan } from "@/_actions/subscription-actions";
import Button from "@/components/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import z from "zod";
import { uploadImage } from "@/lib/upload-action";

const formSchema = z.object({
    name: z.string().min(1, "Name is required.").max(64),
    description: z.string(),
    image: z.string(),
    price: z.number(),
    priceId: z.string().min(10, "You must specify a price ID from Stripe.").max(128),
    annualPrice: z.number(),
    annualPriceId: z.string(),
    annualImage: z.string(),
});

export default function CreatePlanForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            image: "",
            price: 0,
            priceId: "",
            annualPrice: 0,
            annualPriceId: "",
            annualImage: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const res = await createPlan({
                name: value.name,
                description: value.description,
                image: value.image,
                price: value.price,
                priceId: value.priceId,
                annualPrice: value.annualPrice,
                annualPriceId: value.annualPriceId,
                annualImage: value.annualImage,
            });
            if (res.success && res.data) {
                toast.success(
                    `New subscription plan named "${res.data.name} added to the database.`,
                    { position: "top-center" },
                );
                router.refresh();
            } else if (res.success == false && res.error) {
                toast.error(`Couldn't create a new subscription.\n\n${res.error}`, {
                    position: "top-center",
                });
            }
            setLoading(false);
        },
    });

    return (
        <div>
            <Collapsible className="border rounded-xl data-[state=open]:bg-muted">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="group w-full">
                        Create a new subscription plan
                        <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                    <Card className="w-full">
                        <CardContent>
                            <form
                                id="create-plan-form"
                                onSubmit={(ev) => {
                                    ev.preventDefault();
                                    form.handleSubmit();
                                }}
                            >
                                <FieldGroup>
                                    <form.Field name="name">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Name
                                                    </FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(ev) =>
                                                            field.handleChange(ev.target.value)
                                                        }
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="description">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Description
                                                    </FieldLabel>
                                                    <Textarea
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value ?? ""}
                                                        onBlur={field.handleBlur}
                                                        onChange={(ev) =>
                                                            field.handleChange(ev.target.value)
                                                        }
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="image">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            const handleFileChange = async (
                                                ev: React.ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                const file = ev.target.files?.[0];
                                                if (!file) return;

                                                setImageUploading(true);

                                                const fd = new FormData();
                                                fd.append("file", file);

                                                const result = await uploadImage(fd);

                                                if ("error" in result) {
                                                    toast.error(result.error, {
                                                        position: "top-center",
                                                    });
                                                    field.handleChange("");
                                                } else {
                                                    field.handleChange(result.url);
                                                }

                                                field.handleBlur();
                                                setImageUploading(false);
                                            };

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Image
                                                    </FieldLabel>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="border-r border-b"
                                                        id={field.name}
                                                        name={field.name}
                                                        onChange={handleFileChange}
                                                        disabled={imageUploading}
                                                        aria-invalid={isInvalid}
                                                    />

                                                    {imageUploading && (
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                            <Spinner className="size-4" />
                                                            Uploading ...
                                                        </div>
                                                    )}

                                                    {field.state.value && !imageUploading && (
                                                        <div className="flex items-center justify-center w-xl">
                                                            <Image
                                                                src={field.state.value}
                                                                alt="Image for plan"
                                                                width={100}
                                                                height={100}
                                                                className="mt-2 h-28 w-auto rounded object-cover border"
                                                            />
                                                        </div>
                                                    )}

                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="price">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Price
                                                    </FieldLabel>
                                                    <Input
                                                        type="number"
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(ev) =>
                                                            field.handleChange(
                                                                Number(ev.target.value),
                                                            )
                                                        }
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="priceId">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        (Stripe) price ID
                                                    </FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(ev) =>
                                                            field.handleChange(ev.target.value)
                                                        }
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="annualPrice">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Annual price
                                                    </FieldLabel>
                                                    <Input
                                                        type="number"
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value ?? ""}
                                                        onBlur={field.handleBlur}
                                                        onChange={(ev) =>
                                                            field.handleChange(
                                                                Number(ev.target.value),
                                                            )
                                                        }
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="annualPriceId">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        (Stripe) price ID
                                                    </FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value ?? ""}
                                                        onBlur={field.handleBlur}
                                                        onChange={(ev) =>
                                                            field.handleChange(ev.target.value)
                                                        }
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="annualImage">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;

                                            const handleFileChange = async (
                                                ev: React.ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                const file = ev.target.files?.[0];
                                                if (!file) return;

                                                setImageUploading(true);

                                                const fd = new FormData();
                                                fd.append("file", file);

                                                const result = await uploadImage(fd);

                                                if ("error" in result) {
                                                    toast.error(result.error, {
                                                        position: "top-center",
                                                    });
                                                    field.handleChange("");
                                                } else {
                                                    field.handleChange(result.url);
                                                }

                                                field.handleBlur();
                                                setImageUploading(false);
                                            };

                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Image for annual
                                                    </FieldLabel>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="border-r border-b"
                                                        id={field.name}
                                                        name={field.name}
                                                        onChange={handleFileChange}
                                                        disabled={imageUploading}
                                                        aria-invalid={isInvalid}
                                                    />

                                                    {imageUploading && (
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                            <Spinner className="size-4" />
                                                            Uploading ...
                                                        </div>
                                                    )}

                                                    {field.state.value && !imageUploading && (
                                                        <div className="flex items-center justify-center w-xl">
                                                            <Image
                                                                src={field.state.value}
                                                                alt="Image for plan"
                                                                width={100}
                                                                height={100}
                                                                className="mt-2 h-28 w-auto rounded object-cover border"
                                                            />
                                                        </div>
                                                    )}

                                                    {isInvalid && (
                                                        <FieldError
                                                            errors={field.state.meta.errors}
                                                        />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    </form.Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-4">
                            <Button form="create-plan-form" type="reset" variant={"outline"}>
                                Reset
                            </Button>
                            <Button
                                form="create-plan-form"
                                type="submit"
                                variant={"default"}
                                disabled={loading}
                            >
                                Create
                            </Button>
                        </CardFooter>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
