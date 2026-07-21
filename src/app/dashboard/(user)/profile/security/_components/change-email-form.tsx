"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isEmailAddressUsed } from "@/_actions/user-actions";

const formSchema = z.object({
  email: z.string().email("Invalid email").max(145),
  password: z.string().min(1, "Password is required"),
});

type Props = {
  currentEmail: string;
};

export default function ChangeEmailDialog({ currentEmail }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setLoading(true);
      const { error: signInError } = await authClient.signIn.email({
        email: currentEmail,
        password: value.password,
      });

      if (signInError) {
        setServerError("Incorrect password. Please try again.");
        return;
      }
      const emailInUse = await isEmailAddressUsed(value.email);
      if (emailInUse.success && emailInUse.data === true) {
        setServerError(`Email address ${value.email} is already in use.`);
        return;
      }

      const { error: emailError } = await authClient.changeEmail({
        newEmail: value.email,
        callbackURL: "/",
      });

      if (emailError) {
        setServerError("Failed to change email. Please try again.");
        return;
      }

      setLoading(false);
      form.reset();
      setOpen(false);
      router.push("/verify");
      router.refresh();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setServerError(null);
          form.reset();
        }
      }}
    >
      {/* <label className="font-heading text-base leading-snug font-medium">
        Email and Password
      </label> */}

      <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 py-3 max-w-2xl pt-8 border-b border-muted-foreground/20">
        <p className="font-semibold">Change email</p>
        <p className="text-sm text-end">{currentEmail}</p>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer">Edit</Button>
        </DialogTrigger>
      </div>

      <DialogContent className=" sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change email address</DialogTitle>
          <DialogDescription>
            Enter your new email and current password. A verification email will
            be sent shortly.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            form.handleSubmit(ev);
          }}
        >
          <FieldGroup className="p-5">
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
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

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Current Password
                    </FieldLabel>
                    <InputGroup>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={visible ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setVisible((v) => !v)}
                        >
                          {visible ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setServerError(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
