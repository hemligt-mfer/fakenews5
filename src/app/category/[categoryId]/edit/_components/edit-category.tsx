"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";
import { editCategory } from "../_actions/edit-category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Title name is required")
    .max(25, "Maximum of 25 characters"),
});

type EditArticleFormProps = z.infer<typeof formSchema>;

export default function EditCatForm({
  categoryId,
  Category,
}: {
  categoryId: string;
  Category: EditArticleFormProps;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: Category.name ?? "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const result = await editCategory(categoryId, value);
      if (!result.success) {
        toast.error(result.error, { position: "top-center" });
        setLoading(false);
        return;
      }
      toast.success("Category was successfully updated", {
        position: "top-center",
      });
      router.push(`/dashboard/admin/categories`);
      setLoading(false);
    },
  });

  return (
    <Card className="w-3/5 border shadow mx-auto mt-10">
      <CardHeader>
        <CardTitle>Edit category</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="edit-category-form"
          onSubmit={(ev) => {
            ev.preventDefault();
            form.handleSubmit(ev);
          }}
        >
          <FieldGroup>
            <form.Field name="name">
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
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center gap-4">
        <Button
          form="edit-category-form"
          type="reset"
          size="lg"
          variant="outline"
          className="cursor-pointer"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button
          form="edit-category-form"
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
