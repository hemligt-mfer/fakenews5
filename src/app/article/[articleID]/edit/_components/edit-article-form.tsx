"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { editArticle } from "../_actions/edit-article-action";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(200, "Max 200 characters"),
    content: z.string().min(1, "Content is required"),
    image: z.string(),
    location: z.string(),
    category: z.array(z.string()),
    author: z.array(z.string()),
});

type Props = {
    articleId: string;
    defaultValues: {
        title: string;
        summary: string | null;
        content: string;
        image: string | null;
        location: string | null;
        category: { name: string }[];
        author: { alias: string }[];
    };
};

export default function EditArticleForm({ articleId, defaultValues }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categoryInput, setCategoryInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");

    const form = useForm({
        defaultValues: {
            title: defaultValues.title,
            summary: defaultValues.summary ?? "",
            content: defaultValues.content,
            image: defaultValues.image ?? "",
            location: defaultValues.location ?? "",
            category: defaultValues.category.map((c) => c.name),
            author: defaultValues.author.map((a) => a.alias),
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            setLoading(true);
            try {
                const result = await editArticle(articleId, value);
                if (!result.success) {
                    toast.error(result.error, { position: "top-center" });
                } else {
                    toast.success("Article updated.", { position: "bottom-right" });
                    router.push(`/article/${articleId}`);
                }
            } catch (err) {
                toast.error(`Something went wrong: ${err}`, { position: "top-center" });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Card className="min-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit article</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id="edit-article-form"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        form.handleSubmit(ev);
                    }}
                >
                    <FieldGroup>
                        {/* Title */}
                        <form.Field name="title">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                        <Input
                                            id={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Summary */}
                        <form.Field name="summary">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                                        <Input
                                            id={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Content */}
                        <form.Field name="content">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                                        <Textarea
                                            id={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            rows={10}
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Image URL */}
                        <form.Field name="image">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        </form.Field>

                        {/* Location */}
                        <form.Field name="location">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        </form.Field>

                        {/* Categories */}
                        <form.Field name="category" mode="array">
                            {(field) => (
                                <Field className="border p-2">
                                    <FieldLabel>Categories</FieldLabel>
                                    <div className="px-4 py-2 flex flex-wrap gap-1">
                                        {field.state.value.map((name, index) => (
                                            <span key={index} className="px-2 py-1 rounded text-xs border">
                                                {name}
                                                <button
                                                    type="button"
                                                    onClick={() => field.removeValue(index)}
                                                    className="ml-1 opacity-50 hover:opacity-100"
                                                >✕</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative flex items-center">
                                        <Input
                                            value={categoryInput}
                                            onChange={(e) => setCategoryInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    categoryInput.split(",").map((n) => n.trim()).filter(Boolean)
                                                        .forEach((n) => field.pushValue(n));
                                                    setCategoryInput("");
                                                }
                                            }}
                                            placeholder="Type and press Enter"
                                        />
                                        <Button size="xs" type="button" className="absolute right-1"
                                            onClick={() => {
                                                categoryInput.split(",").map((n) => n.trim()).filter(Boolean)
                                                    .forEach((n) => field.pushValue(n));
                                                setCategoryInput("");
                                            }}>Add</Button>
                                    </div>
                                </Field>
                            )}
                        </form.Field>

                        {/* Authors */}
                        <form.Field name="author" mode="array">
                            {(field) => (
                                <Field className="border p-2">
                                    <FieldLabel>Authors</FieldLabel>
                                    <div className="px-4 py-2 flex flex-wrap gap-1">
                                        {field.state.value.map((alias, index) => (
                                            <span key={index} className="px-2 py-1 rounded text-xs border">
                                                {alias}
                                                <button
                                                    type="button"
                                                    onClick={() => field.removeValue(index)}
                                                    className="ml-1 opacity-50 hover:opacity-100"
                                                >✕</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative flex items-center">
                                        <Input
                                            value={authorInput}
                                            onChange={(e) => setAuthorInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    authorInput.split(",").map((n) => n.trim()).filter(Boolean)
                                                        .forEach((n) => field.pushValue(n));
                                                    setAuthorInput("");
                                                }
                                            }}
                                            placeholder="Author alias"
                                        />
                                        <Button size="xs" type="button" className="absolute right-1"
                                            onClick={() => {
                                                authorInput.split(",").map((n) => n.trim()).filter(Boolean)
                                                    .forEach((n) => field.pushValue(n));
                                                setAuthorInput("");
                                            }}>Add</Button>
                                    </div>
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button form="edit-article-form" type="submit" size="lg" disabled={loading}>
                    {loading ? <Spinner /> : "Save changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}
