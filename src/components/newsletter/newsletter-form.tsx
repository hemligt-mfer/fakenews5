"use client";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Category, Author } from "@/lib/types";
import z from "zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  email: z.email(),
  category: z.array(z.string()),
  authors: z.array(z.string()),
});

export default function NewsletterForm({
  categories,
  authors,
  userId,
}: {
  categories: Category[];
  authors: Author[];
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const user = userId;
 
  const form = useForm({
    defaultValues: {
      email: "",
      categories: categories,
      authors: authors,
    },
    validators: { onSubmit: formSchema },
    onSubmit: (value) => console.log(value),
  });

  return (
    <div>
      <form
        id="newsletter-form"
        onSubmit={(ev) => {
          ev.preventDefault();
          form.handleSubmit(ev);
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
                    type="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="categories" mode="array">
            {(field) => {
              return (
                <div>
                  {field.state.value.map((_, i) => {
                    return (
                      <form.Field key={i} name={`categories[${i}].name`}>
                        {(subField) => {
                          return (
                            <div>
                              <label>
                                <div>Name for category {i}</div>
                                <input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                ></input>
                              </label>
                            </div>
                          );
                        }}
                      </form.Field>
                    );
                  })}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="authors" mode="array">
            {(field) => {
              return (
                <div>
                  {field.state.value.map((_, i) => {
                    return (
                      <form.Field key={i} name={`authors[${i}].alias`}>
                        {(subField) => {
                          return (
                            <div>
                              <label>
                                <div>Name for category {i}</div>
                                <input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                ></input>
                              </label>
                            </div>
                          );
                        }}
                      </form.Field>
                    );
                  })}
                </div>
              );
            }}
          </form.Field>
        </FieldGroup>
      </form>
      <div>
        <Button
          form="newsletter-form"
          type="reset"
          size="lg"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button
          form="newsletter-form"
          type="submit"
          size="lg"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Subscribe now!"}
        </Button>
      </div>
    </div>
  );
}
