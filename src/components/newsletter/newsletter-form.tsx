"use client";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  email: z.email("Enter a valid email address"),
  categories: z.array(z.string()),
  authors: z.array(z.string()),
});

export default function NewsletterForm({
  categories,
  authors,
}: {
  categories: string[];
  authors: string[];
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      categories: [] as string[],
      authors: [] as string[],
    },
    validators: { onSubmit: formSchema },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className="w-full max-w-100 border p-4 ">
      <form
        id="newsletter-form"
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    className="border-r border-b"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Your email address"
                    type="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <div>
            <h1 className="font-medium mb-2">
              Subscribe to selected categories
            </h1>
            <form.Field name="categories">
              {(field) => (
                <div>
                  {categories.map((category) => {
                    const checked = field.state.value.includes(category);
                    return (
                      <label key={category} className="flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            field.handleChange((prev) =>
                              isChecked
                                ? [...prev, category]
                                : prev.filter((c) => c !== category),
                            );
                          }}
                        />
                        <span>{category}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </form.Field>
          </div>
              <div>
                <h1 className="font-medium mb-2">Authors to follow</h1>
          <form.Field name="authors">
            {(field) => (
              <div>
                {authors.map((author) => {
                  const checked = field.state.value.includes(author);
                  return (
                    <label key={author} className="flex items-center gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          field.handleChange((prev) =>
                            isChecked
                              ? [...prev, author]
                              : prev.filter((c) => c !== author),
                          );
                        }}
                      />
                      <span>{author}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </form.Field>
          </div>

          <Button
            form="newsletter-form"
            type="submit"
            size="lg"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Subscribe now!"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
