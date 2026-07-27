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
import {
  setNewsletterActive,
  setNewsletterSettings,
} from "./_actions/newsletter-actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

const formSchema = z.object({
  email: z.email("Enter a valid email address."),
  categories: z.array(z.string()),
  authors: z.array(z.string()),
});

export default function NewsletterForm({
  categories,
  authors,
  isSubbed,
  email,
  dCats,
  dAuthor,
}: {
  categories: string[];
  authors: string[];
  isSubbed: boolean;
  email: string;
  dCats: string[];
  dAuthor: string[];
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const user = await authClient.getSession();
      if (!user || !user.data) return;

      const res = await setNewsletterActive(user.data.user.id, false);
      if (res.success) {
        toast.success("Newsletter cancelled.");
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const form = useForm({
    defaultValues: {
      email: email ?? "",
      categories: dCats ?? ([] as string[]),
      authors: dAuthor ?? ([] as string[]),
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const user = await authClient.getSession();
        if (!user || !user.data) return;

        const res = await setNewsletterSettings(
          user.data.user.id,
          value.email,
          value.authors,
          value.categories,
        );

        if (res.success) {
          toast.success("Subscribed!");
        } else {
          toast.error(res.error);
        }
      } finally {
        setLoading(false);
        router.refresh();
      }
    },
  });

  return (
    <div className="w-full max-w-100 rounded-xl shadow border p-4 ">
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
            <Collapsible className="border rounded-lg data-[state=open]:bg-muted">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="group w-full">
                  Select categories
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                <form.Field name="categories">
                  {(field) => (
                    <div>
                      {categories.map((category) => {
                        const checked = field.state.value.includes(category);
                        return (
                          <div
                            className="flex gap-2 items-center"
                            key={category}
                          >
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
                          </div>
                        );
                      })}
                    </div>
                  )}
                </form.Field>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <Collapsible className="border rounded-lg data-[state=open]:bg-muted">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="group w-full">
                  Authors to follow
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                <form.Field name="authors">
                  {(field) => (
                    <div>
                      {authors.map((author) => {
                        const checked = field.state.value.includes(author);
                        return (
                          <div key={author} className="flex items-center gap-2">
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
                          </div>
                        );
                      })}
                    </div>
                  )}
                </form.Field>
              </CollapsibleContent>
            </Collapsible>
          </div>
          {isSubbed ? (
            <>
              <Button
                form="newsletter-form"
                type="submit"
                size="lg"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? <Spinner /> : "Update newsletter"}
              </Button>
              <Button
                onClick={handleCancel}
                size="lg"
                disabled={loading}
                className="cursor-pointer"
                variant="destructive"
              >
                {loading ? <Spinner /> : "Cancel newsletter"}
              </Button>
            </>
          ) : (
            <Button
              form="newsletter-form"
              type="submit"
              size="lg"
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? <Spinner /> : "Subscribe now!"}
            </Button>
          )}
        </FieldGroup>
      </form>
    </div>
  );
}
