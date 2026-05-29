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
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email().max(128),
  password: z.string().min(8).max(128),
});
export default function SignInForm() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });
      if (error) {
        if (error.code === "EMAIL NOT VERIFIED") {
          router.push("/auth/verify-email");
          return;
        }

        alert(error.message || "An unknown error occurred");
        return;
      }
      router.push("/");
      router.refresh();
    },
  });

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Fill out the form below to create an account
        </CardDescription>
        <CardContent className="py-4">
          <form
            id="sign-in-form"
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

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <InputGroup className="w-full bg-background">
                        <Input
                          className="rounded-r-none"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(ev) => field.handleChange(ev.target.value)}
                          placeholder="Enter password"
                          type={visible ? "text" : "password"}
                          autoComplete="current-password"
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Toggle visibility"
                            onClick={() => setVisible(!visible)}
                            size="icon-xs"
                            variant="ghost"
                          >
                            {visible ? <EyeOffIcon /> : <EyeIcon />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      <Link href={'/'} className="flex justify-end">Forgot password</Link>
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
        <Button
          onClick={() => toast("Logged for new updates")}
          className="w-full"
          form="sign-in-form"
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}
