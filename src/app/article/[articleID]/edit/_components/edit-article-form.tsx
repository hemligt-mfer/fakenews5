"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import editArticle from "../_actions/edit-article-action";
import { Editor } from "@/components/tiptap";
import { uploadImage } from "@/lib/upload-action";
import Image from "next/image";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(1000, "Between 1-1000 characters"),
    content: z.string().min(1, "Content text is required"),
    image: z.string(),
    category: z.array(z.string()),
    location: z.string(),
    author: z.array(z.string()),
});

type EditArticleFormProps = {
    articleId: string;
    defaultValues: {
        title: string;
        summary: string;
        content: string;
        image: string;
        category: string[];
        location: string;
        author: string[];
    };
};

export default function EditArticleForm({ articleId, defaultValues }: EditArticleFormProps) {
    const [categoryInput, setCategoryInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const router = useRouter();

    const form = useForm({
        defaultValues,
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const result = await editArticle(articleId, value);
            if (result.success === false && result.error) {
                toast.error(result.error, { position: "top-center" });
                setLoading(false);
            } else {
                toast.success("Article updated successfully", {
                    position: "top-center",
                });
                router.push(`/article/${articleId}`);
            }
        },
    });

    return (
        <Card className="w-2xl mx-auto">
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
                        <form.Field name="title">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                        <Input
                                            className="border-r border-b"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="content">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                                        <Editor
                                            initialMarkdown={field.state.value}
                                            onChange={(markdown) => {
                                                field.handleChange(markdown);
                                                field.handleBlur();
                                            }}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="summary">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                                        <Input
                                            className="border-r border-b"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
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
                                        toast.error(result.error, { position: "top-center" });
                                        field.handleChange("");
                                    } else {
                                        field.handleChange(result.url);
                                    }

                                    field.handleBlur();
                                    setImageUploading(false);
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
                                            <Image
                                                src={field.state.value}
                                                alt="Selected article image preview"
                                                width={100}
                                                height={100}
                                                className="mt-2 h-100 w-auto rounded object-contain"
                                            />
                                        )}

                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <div className="flex gap-4">
                            <form.Field name="category" mode="array">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    const handleAdd = () => {
                                        const names = categoryInput
                                            .split(",")
                                            .map((n) => n.trim())
                                            .filter(Boolean);
                                        names.forEach((name) => field.pushValue(name));
                                        setCategoryInput("");
                                    };
                                    return (
                                        <Field
                                            data-invalid={isInvalid}
                                            className="border p-2 flex-1"
                                        >
                                            <FieldLabel>Category</FieldLabel>
                                            <div className="px-4 py-2">
                                                {field.state.value.map((name, index) => (
                                                    <span
                                                        className="px-2 py-1 rounded mr-1 mt-1 text-xs"
                                                        key={index}
                                                    >
                                                        {`${name} `}
                                                        <button
                                                            type="button"
                                                            onClick={() => field.removeValue(index)}
                                                            className="hover:opacity-100 opacity-50"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="relative flex items-center">
                                                <Input
                                                    className="border pr-16"
                                                    value={categoryInput}
                                                    onChange={(ev) =>
                                                        setCategoryInput(ev.target.value)
                                                    }
                                                    onKeyDown={(ev) =>
                                                        ev.key === "Enter" && handleAdd()
                                                    }
                                                    placeholder="Economy, Sports"
                                                />
                                                <Button
                                                    size="xs"
                                                    type="button"
                                                    onClick={handleAdd}
                                                    className="absolute right-1 my-auto"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </div>

                        <div className="flex gap-6">
                            <form.Field name="author" mode="array">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    const handleAdd = () => {
                                        const names = authorInput
                                            .split(",")
                                            .map((n) => n.trim())
                                            .filter(Boolean);
                                        names.forEach((name) => field.pushValue(name));
                                        setAuthorInput("");
                                    };
                                    return (
                                        <Field
                                            data-invalid={isInvalid}
                                            className="flex-1 border p-2"
                                        >
                                            <FieldLabel>Author</FieldLabel>
                                            <div className="px-4 py-2">
                                                {field.state.value.map((name, index) => (
                                                    <span
                                                        className="px-2 py-1 rounded mr-1 mt-1 text-xs"
                                                        key={index}
                                                    >
                                                        {`${name} `}
                                                        <button
                                                            type="button"
                                                            onClick={() => field.removeValue(index)}
                                                            className="hover:opacity-100 opacity-50"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="relative flex items-center">
                                                <Input
                                                    className="border pr-16"
                                                    value={authorInput}
                                                    onChange={(ev) =>
                                                        setAuthorInput(ev.target.value)
                                                    }
                                                    onKeyDown={(ev) =>
                                                        ev.key === "Enter" && handleAdd()
                                                    }
                                                    placeholder="Author alias"
                                                />
                                                <Button
                                                    size="xs"
                                                    type="button"
                                                    onClick={handleAdd}
                                                    className="absolute right-1 my-auto"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <form.Field name="location">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid} className="flex-1">
                                            <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                                            <Input
                                                className="border-r border-b"
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
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button
                    form="edit-article-form"
                    type="reset"
                    size="lg"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>
                <Button
                    form="edit-article-form"
                    type="submit"
                    size="lg"
                    className="cursor-pointer"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : "Save changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}
