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
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { changePasswordAction } from "../actions/user.actions";
import { useState } from "react";
import { ChangePasswordDto } from "../services/user.service";

interface ChangePasswordProps extends React.ComponentProps<"div"> {}

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const ChangePassword = ({ className }: ChangePasswordProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);
    
    const result = await changePasswordAction(values);
    
    if (result.success) {
      setSuccessMessage("Password changed successfully");
      reset();
    } else {
      setServerError(result.error || "Failed to change password");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
         <div className="space-y-2">
            <h3 className="text-lg font-medium">Update Password</h3>
            <p className="text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
              <Input
                id="current_password"
                type="password"
                {...register("current_password")}
              />
              {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password.message}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
              <Input
                id="password_confirmation"
                type="password"
                {...register("password_confirmation")}
              />
               {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
            </Field>

            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Change Password"}
            </Button>
          </FieldGroup>
        </form>
    </div>
  );
};
