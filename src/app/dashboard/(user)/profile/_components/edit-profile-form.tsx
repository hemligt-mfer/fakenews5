"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";

import z from "zod";
import { EditUser } from "../_actions/user-action";
import ChangeEmailDialog from "./change-email-form";
import ChangePasswordDialog from "./change-password-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

type Props = {
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
    user_info?: {
      phoneNumber: string | null;
      birthdate: Date;
      address: {
        city: string;
        country: string;
        street: string;
        zip: string;
      };
    } | null;
  };
};

const formSchema = z.object({
  id: z.string(),
  email: z.string().max(145),
  name: z.string().max(145),
  city: z.string(),
  country: z.string(),
  street: z.string(),
  zip: z.string(),
  phoneNumber: z.string(),
  birthdate: z.iso.date(),
  image: z.string(),
});

export default function EditProfileForm({ user }: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(user.user_info?.birthdate ?? ""),
  );
  // const[visible, setVisible] =React.useState(false)
  const form = useForm({
    defaultValues: {
      id: user.id,
      email: user.email,
      name: user.name,
      city: user.user_info?.address.city ?? "",
      country: user.user_info?.address.country ?? "",
      street: user.user_info?.address.street ?? "",
      zip: user.user_info?.address.zip ?? "",
      phoneNumber: user.user_info?.phoneNumber ?? "",
      birthdate: user.user_info?.birthdate.toISOString().split("T")[0] ?? "",
      image: user.image ?? "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await EditUser(user.id, value);
    },
  });

  return (
    <>
      {/* Regular info */}

      <Card className="max-w-4xl p-4 mx-auto">
        <CardContent>
          <Collapsible className="rounded-md data-[state=open]:bg-muted">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="group w-full">
                User settings
                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
              <Card className="mx-auto w-full">
                <CardContent>
                  <form
                    onSubmit={(ev) => {
                      form.handleSubmit(ev);
                      ev.preventDefault();
                    }}
                  >
                    <FieldGroup>
                      <form.Field name="name">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                              <Input
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

                      <form.Field name="phoneNumber">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Phone number
                              </FieldLabel>
                              <Input
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

                      <form.Field name="birthdate">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Birthdate
                              </FieldLabel>
                              <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    id="date"
                                    className="justify-start font-normal"
                                  >
                                    {date
                                      ? date.toLocaleDateString("sv-SE")
                                      : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto overflow-hidden p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    defaultMonth={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                      setDate(date);
                                      if (date) {
                                        field.handleChange(
                                          date.toLocaleDateString("sv-SE"),
                                        );
                                      }
                                      setOpen(false);
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>
                      <h1>Address</h1>
                      <div className="grid grid-cols-2 gap-4">
                        <form.Field name="street">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Street
                                </FieldLabel>
                                <Input
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
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name="city">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  City
                                </FieldLabel>
                                <Input
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
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name="country">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Country
                                </FieldLabel>
                                <Input
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
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name="zip">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Zip
                                </FieldLabel>
                                <Input
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
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                      </div>
                      <Field orientation="horizontal">
                        <Button
                          type="reset"
                          className="bg-background text-black border border-slate-300 cursor-pointer"
                          onClick={() => {
                            form.reset();
                            setDate(new Date(user.user_info?.birthdate ?? ""));
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          className="cursor-pointer"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Submit"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Better-auth /password/email */}

      <Card className="max-w-4xl mt-5 mx-auto p-4 mb-5">
        <CardContent>
          <Collapsible className="rounded-md data-[state=open]:bg-muted">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="group w-full">
                Email and Password
                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
              <ChangeEmailDialog currentEmail={user.email} />
              <ChangePasswordDialog currentEmail={user.email} />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </>
  );
}
