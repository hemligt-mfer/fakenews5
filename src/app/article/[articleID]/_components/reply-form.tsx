"use client";

import { addComment } from "@/_actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    reply: z
        .string()
        .min(1, "You can't leave an empty comment.")
        .max(2000, "Comment can't be longer than 2000 characters."),
});

export default function ReplyForm({
    articleId,
    replyTo,
    edit,
}: {
    articleId: string;
    replyTo: string | null;
    edit: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(true);
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            reply: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const comment = await addComment(articleId, value.reply, replyTo);
            if (comment.success === false) {
                toast.error(`Couldn't save reply to the database.\n\n${comment.error}`);
            }
            setShow(false);
            setLoading(false);
            router.refresh();
        },
    });

    return (
        <div>
            {show && (
                <Card className="w-2xl mx-auto mb-4">
                    <CardHeader>
                        <CardTitle className="flex">
                            <span className="mr-auto">Reply</span>
                            <Button onClick={() => setShow(false)}>
                                <X />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="reply"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                form.handleSubmit(ev);
                            }}
                        >
                            <FieldGroup>
                                <form.Field name="reply">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(ev) =>
                                                        field.handleChange(ev.target.value)
                                                    }
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>
                            </FieldGroup>
                            <CardFooter className="flex gap-2 justify-center p-1">
                                <Button type="reset" variant="outline" onClick={() => form.reset()}>
                                    Clear
                                </Button>
                                <Button type="submit" disabled={loading} form="reply">
                                    {loading ? <Spinner /> : "Submit"}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
