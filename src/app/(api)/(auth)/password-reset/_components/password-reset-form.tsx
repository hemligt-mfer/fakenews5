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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export default function PasswordResetForm() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState({password:false, confirmPassword:false});
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("token") as string;
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      const { error } = await authClient.resetPassword({
        token: tokenId,
        newPassword: value.password,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message || "An unknown error occurred", {
          position: "top-center",
        });
      }
      router.push("/");
      router.refresh();
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
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          New Password
                        </FieldLabel>
                        <InputGroup className="w-full bg-background">
                          <Input
                            className="rounded-r-none"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(ev) =>
                              field.handleChange(ev.target.value)
                            }
                            placeholder="Enter password"
                            type={visible.password ? "text" : "password"}
                            autoComplete="current-password"
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              aria-label="Toggle visibility"
                              onClick={() => setVisible((v)=>({...v, password: !v.password}))}
                              size="icon-xs"
                              variant="ghost"
                            >
                              {visible.password ?<EyeIcon /> : <EyeOffIcon /> }
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="confirmPassword">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm Password
                        </FieldLabel>
                        <InputGroup className="w-full bg-background">
                          <Input
                            className="rounded-r-none"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(ev) =>
                              field.handleChange(ev.target.value)
                            }
                            placeholder="Enter password"
                            type={visible.confirmPassword ? "text" : "password"}
                            autoComplete="current-password"
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              aria-label="Toggle visibility"
                              onClick={() => setVisible((v)=>({...v, confirmPassword: !v.confirmPassword}))}
                              size="icon-xs"
                              variant="ghost"
                            >
                              {visible.confirmPassword ?<EyeIcon /> : <EyeOffIcon />  }
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>

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
          <Button type="submit" className="w-full cursor-pointer" form="forgot-password-form">
            {loading ? (
              <>
                <Spinner data-icon="inline-start" />
                Loading
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
