"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
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
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const formSchema = z
  .object({
    oldPassword: z.string().min(8, "password length must be =<8"),
    password: z.string().min(8, "password length must be =<8"),
    confirmPassword: z.string(),
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

type Props = {
  currentEmail: string;
};

export default function ChangePasswordDialog({ currentEmail }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState({
    password: false,
    oldPassword: false,
    confirmPassword: false,
  });
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: { oldPassword: "", password: "", confirmPassword: "" },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setLoading(true);
      const { error: signInError } = await authClient.signIn.email({
        email: currentEmail,
        password: value.oldPassword,
      });

      if (signInError) {
        setServerError("Incorrect password. Please try again.");
        return;
      }

      const { error: passwordError } = await authClient.changePassword({
        newPassword: value.password,
        currentPassword: value.oldPassword,
        revokeOtherSessions: true,
      });
      if (passwordError) {
        setServerError("Wrong password");
        return;
      }

      form.reset();
      setOpen(false);
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
      <DialogTrigger asChild>
        <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 py-3 max-w-2xl cursor-pointer border-b border-muted-foreground/20">
          <p className= "font-semibold">Password</p>
          <span /> {/* empty middle cell keeps columns aligned */}
          <Button variant="outline" className="cursor-pointer">Edit</Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password and the new password to update password
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            form.handleSubmit(ev);
          }}
        >
          <FieldGroup>
            <form.Field name="oldPassword">
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
                        type={visible.oldPassword ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setVisible((v) => ({
                              ...v,
                              oldPassword: !v.oldPassword,
                            }))
                          }
                        >
                          {visible.oldPassword ? (
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
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <InputGroup>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={visible.password ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setVisible((v) => ({ ...v, password: !v.password }))
                          }
                        >
                          {visible.password ? (
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
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <InputGroup>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={visible.confirmPassword ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setVisible((v) => ({
                              ...v,
                              confirmPassword: !v.confirmPassword,
                            }))
                          }
                        >
                          {visible.confirmPassword ? (
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
