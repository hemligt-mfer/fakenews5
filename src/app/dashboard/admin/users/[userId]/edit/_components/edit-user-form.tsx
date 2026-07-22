"use client";
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
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import UserAction from "../_actions/user-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { roles } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { uploadImage } from "@/lib/upload-action";

type Users = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  user_info: {
    id: string;
    userId: string;
    phoneNumber: string | null;
    birthdate: Date;
    address: {
      id: string;
      street: string;
      city: string;
      country: string;
      zip: string;
    };
  } | null;
  author: {
    id: string;
    userId: string;
    alias: string;
  } | null;
};

export type Props = {
  data: Users;
};

const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Name is required, atleast 3 characters")
    .max(50, "Maximum of 50 characters"),
  email: z.email(),
  image: z.string(),
  phone: z.string(),
  birthdate: z.iso.date(),
  role: z.enum(roles),
  authorAlias: z.string().max(20, "Maximum 20 characters"),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
  userInfoId: z.string(),
});

type Role = (typeof roles)[number];

export default function EditUserForm({ data }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const router = useRouter();
  const anchor = React.useRef(null);
  const form = useForm({
    defaultValues: {
      id: data.id,
      name: data.name,
      email: data.email,
      image: data.image ?? "",
      role: data.role as Role,
      phone: data.user_info?.phoneNumber ?? "",
      birthdate: data.user_info?.birthdate.toISOString().split("T")[0] ?? "",
      authorAlias: data.author?.alias ?? "",
      street: data.user_info?.address.street ?? "",
      city: data.user_info?.address.city ?? "",
      zip: data.user_info?.address.zip ?? "",
      country: data.user_info?.address.country ?? "",
      userInfoId: data.user_info?.id ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (imageFile) {
        let imageUrl = "";
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadResult = await uploadImage(fd);
        if ("error" in uploadResult) {
          toast.error(uploadResult.error, { position: "top-center" });
          return;
        }
        imageUrl = uploadResult.url;
        await UserAction(data.id, { ...value, image: imageUrl });
      } else {
        await UserAction(data.id, value)
      }
      toast.success("User was successfully updated.", {
        position: "top-center",
      });
      router.push(`/dashboard/admin/users/${data.id}`);
      router.refresh();
    },
  });

  return (
    <div>
      <div className="flex flex-col border bg-sidebar rounded-2xl m-6 px-6 py-2 text-center">
        <p className="border-b mb-5">
          Created at: {new Intl.DateTimeFormat("sv-SE").format(data.createdAt)}
        </p>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            form.handleSubmit(ev);
          }}
        >
          <FieldGroup>
            <div className="flex gap-12">
              <form.Field name="id">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>User ID</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                        disabled
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="role">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Role</FieldLabel>
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
            </div>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
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
                      type="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="image">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const handleFileChange = (
                  ev: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  const file = ev.target.files?.[0];
                  if (!file) return;

                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));

                  field.handleChange(file.name);
                  field.handleBlur();
                };

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      className="border-r border-b"
                      id={field.name}
                      name={field.name}
                      onChange={handleFileChange}
                      aria-invalid={isInvalid}
                    />

                    {data.image && imagePreview === "" && (
                      <div>
                        <img
                          src={data.image}
                          alt="Current avatar"
                          width={50}
                          height={50}
                          className="mt-2 mx-auto h-50 w-50 rounded object-cover border"
                        />
                      </div>
                    )}
                    {imagePreview && (
                      <div>
                        <img
                          src={imagePreview}
                          alt="Selected avatar image preview"
                          className="mt-2 mx-auto h-50 w-50 rounded object-cover border"
                        />
                      </div>
                    )}

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <div className="flex gap-12">
              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Phone number</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
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

              <form.Field name="birthdate">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>
                        Date of birth
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={String(field.state.value)}
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

              <form.Field name="authorAlias">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <form.Subscribe selector={(state) => state.values.role}>
                      {(role) => {
                        const isDisabled = role === "user" || role === "editor";

                        return (
                          <Field data-invalid={isInvalid} className="flex-1">
                            <FieldLabel htmlFor={field.name}>
                              Author alias
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value ?? ""}
                              onBlur={field.handleBlur}
                              onChange={(ev) =>
                                field.handleChange(ev.target.value)
                              }
                              aria-invalid={isInvalid}
                              disabled={isDisabled}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Subscribe>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="userInfoId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="flex-1">
                    <FieldLabel htmlFor={field.name}>User info ID</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      aria-invalid={isInvalid}
                      disabled
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <div className="flex gap-12">
              <form.Field name="street">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Street</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
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

              <form.Field name="city">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>City</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
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

              <form.Field name="zip">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Zip</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
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

              <form.Field name="country">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
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
            </div>

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
              <Button asChild variant="outline">
                <Link href={`/dashboard/admin/users`}>Back to user table</Link>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
