"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { registerAction } from "../actions/auth.actions";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterDto } from "../dto/user.dto";

export const RegisterForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterDto>();

  const password = watch("password");

  const onSubmit = async (values: RegisterDto) => {
    setServerError(null);
    const result = await registerAction(values);
    if (result?.success) {
      router.push("/dashboard");
    } else {
      setServerError(result.error || "Algo salió mal");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Name Input */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FieldDescription className="text-red-500 text-xs">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Email Input */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <FieldDescription className="text-red-500 text-xs">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password Input */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500 text-xs">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Confirm Password Input */}
              <Field>
                <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...register("password_confirmation", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                />
                {errors.password_confirmation && (
                  <FieldDescription className="text-red-500 text-xs">
                    {errors.password_confirmation.message}
                  </FieldDescription>
                )}
              </Field>

              {serverError && (
                <div className="text-red-500 text-sm font-medium text-center">
                  {serverError}
                </div>
              )}

              {/* Submit Button */}
              <Field>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Creating account..." : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login" className="underline">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
