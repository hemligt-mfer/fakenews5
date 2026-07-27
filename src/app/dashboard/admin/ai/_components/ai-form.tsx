"use client";
import Button from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import z from "zod";
import { generateResponse } from "../_actions/ai";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { OutputEditor } from "./output-editor";

const formSchema = z.object({
    input: z
        .string()
        .min(5, "You have to write a longer prompt for the AI to generate a good answer."),
});

export default function AIForm() {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setDotCount((prev) => (prev % 3) + 1);
        }, 400);
        return () => clearInterval(interval);
    }, [loading]);

    const loadingText = `Generating output ${".".repeat(dotCount)}`;

    const form = useForm({
        defaultValues: {
            input: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const result = await generateResponse(value.input);
            setOutput(result);
            setLoading(false);
        },
    });
    return (
        <Card className="md:w-3xl mx-auto mt-5 shadow">
            <CardHeader>
                <CardTitle>Prompt our AI</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    Do you suffer from writer&apos;s block? Ask our AI for help. You can prompt it
                    with whatever you feel like.
                </p>
                <form
                    id="ai-form"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        form.handleSubmit(ev);
                    }}
                >
                    <FieldGroup className="mt-10">
                        <form.Field name="input">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Input</FieldLabel>
                                        <Textarea
                                            className="border h-50"
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
                        <div className="flex justify-center gap-4">
                            <Button
                                form="ai-form"
                                type="reset"
                                variant="outline"
                                size="lg"
                                className="cursor-pointer"
                                onClick={() => form.reset()}
                            >
                                Reset
                            </Button>
                            <Button
                                form="ai-form"
                                type="submit"
                                size="lg"
                                className="cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Submit"}
                            </Button>
                        </div>
                        <div>
                            <div className="flex">
                                <Label className="mb-3">Output (pure text)</Label>
                                <Button
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        navigator.clipboard.writeText(output);
                                        toast.success("Copied to clipboard!", {
                                            position: "top-center",
                                        });
                                    }}
                                    variant="ghost"
                                    className="mr-2 mb-2 ml-auto py-0 px-2 border-primary justify-center items-center"
                                >
                                    <Copy className="" size={30} />
                                </Button>
                            </div>
                            <Textarea
                                id="output-txt"
                                name="oputput-txt"
                                className="border h-50"
                                value={loading ? loadingText : output}
                                readOnly
                            />
                            <hr className="mt-5 mb-5" />
                            <div className="flex">
                                <Label className="mb-3">Output (styled)</Label>
                                <Button
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        navigator.clipboard.writeText(output);
                                        toast.success("Copied to clipboard!", {
                                            position: "top-center",
                                        });
                                    }}
                                    variant="ghost"
                                    className="mr-2 mb-2 ml-auto py-0 px-2 border-primary justify-center items-center"
                                >
                                    <Copy size={30} />
                                </Button>
                            </div>
                            <OutputEditor markdown={loading ? loadingText : output} />
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
