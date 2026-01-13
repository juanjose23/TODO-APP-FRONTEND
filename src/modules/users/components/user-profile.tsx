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
import { updateProfileAction } from "../actions/user.actions";
import { useState } from "react";
import { UserDto } from "@/modules/auth/dto/user.dto";

interface UserProfileProps extends React.ComponentProps<"div"> {
  user: UserDto;
}

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

import { User, Mail } from "lucide-react";
import { useEffect } from "react";

// ... (schema and type definition remain same)

export const UserProfile = ({ user, className }: UserProfileProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  // Ensure form updates if user prop changes
  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    // ... (onSubmit logic remains same)
    setServerError(null);
    setSuccessMessage(null);
    const result = await updateProfileAction(values);
    
    if (result.success) {
      setSuccessMessage("Profile updated successfully");
    } else {
      setServerError(result.error || "Failed to update profile");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
        <div className="space-y-2">
            <h3 className="text-lg font-medium">Profile Information</h3>
            <p className="text-sm text-muted-foreground">Update your account's profile information and email address.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    id="name"
                    className="pl-9"
                    {...register("name")}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    {...register("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </Field>

            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </FieldGroup>
        </form>
    </div>
  );
};
