"use client";
import { type User } from "@/lib/userColumns";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import React from "react";
import { Button } from "@/components/ui/button";
import UserAction from "../_actions/user-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  data: User;
};

const roles = ["USER", "ADMIN", "EDITOR"] as const;

const formSchema = z.object({
  role: z.enum(roles),
});

type Role = (typeof roles)[number];

export default function EditUserForm({ data }: Props) {
  const router = useRouter();
  const anchor = React.useRef(null);
  const form = useForm({
    defaultValues: {
      role: data.role as Role,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await UserAction(data.id, value);
      toast.success("User was successfully updated.", {
        position: "bottom-right",
      });
      router.push("/dashboard/admin/users");
      router.refresh();
    },
  });

  return (
    <div>
      <div className="flex flex-col border bg-sidebar rounded-2xl m-6 px-6 py-2">
        <p>Email: {data.email}</p>
        <p>Name: {data.name}</p>
        <p>
          Created at: {new Intl.DateTimeFormat("sv-SE").format(data.createdAt)}
        </p>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            form.handleSubmit(ev);
          }}
        >
          <FieldGroup className="">
            <form.Field name="role">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="max-w-xs">
                    <FieldLabel htmlFor={field.name} className="text-md">
                      Role:
                    </FieldLabel>
                    <Combobox
                      autoHighlight
                      items={roles}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value !== null) {
                          field.handleChange(value as Role);
                        }
                      }}
                    >
                      <ComboboxChips ref={anchor}>
                        <ComboboxValue>
                          {(value: string) => value}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No role selected.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Field orientation="horizontal">
              <Button className="cursor-pointer" type="submit">
                Submit
              </Button>
              <Button
                className="cursor-pointer"
                type="reset"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
