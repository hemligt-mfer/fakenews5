"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email().max(128),
});
export default function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/password-reset",
      });
      if (error) {
        toast.error(error.message || "An unknown error occurred", {
          position: "top-center",
        });
      }
      // alert("y5y");
      router.push("/forgot-password");
      router.refresh();
      // alert(error.message || "An unknown error occurred");
      // return;
    },
  });

  return (
    <div className="w-6xl">
      <Card className="w-xl mt-10 mx-auto">
        <CardHeader>
          <CardTitle className="text-lg ">Reset password</CardTitle>
          <CardDescription>Enter email for password reset link</CardDescription>
          <CardContent className="py-4">
            <form
              id="forgot-password-form"
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
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(ev) => field.handleChange(ev.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="email"
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
        </CardHeader>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                form="forgot-password-form"
              >
                Send Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verification link sent!</DialogTitle>
                <DialogDescription>Click on the sent to your e-mail to create a new password</DialogDescription>
              </DialogHeader>
              <DialogFooter><DialogClose asChild><Button>close</Button></DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
