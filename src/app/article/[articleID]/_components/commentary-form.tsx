"use client";
import { addComment } from "@/_actions/comment-actions";
import Button from "@/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";

const formSchema = z.object({
    comment: z.string().min(1, "Comment has to be at least one character.").max(2000),
});

export default function CommentaryForm({
    articleId,
    replyTo,
}: {
    articleId: string;
    replyTo: string | null;
}) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        defaultValues: {
            comment: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const comment = await addComment(articleId, value.comment, replyTo);
            console.log(comment);
            setLoading(false);
        },
    });

    return (
        <div>
            <Card className="w-2xl mx-auto mt-4">
                <CardHeader>
                    <CardTitle>Leave a comment ...</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id="comment"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            form.handleSubmit(ev);
                        }}
                    >
                        <FieldGroup>
                            <form.Field name="comment">
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
                        <CardFooter className="flex gap-2 justify-center">
                            <Button type="reset" variant="outline" onClick={() => form.reset()}>
                                Clear
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Spinner /> : "Submit"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
