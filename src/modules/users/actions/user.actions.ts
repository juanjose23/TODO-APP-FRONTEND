"use server";

import { UserService, UpdateProfileDto, ChangePasswordDto } from "../services/user.service";
import { cookies } from "next/headers";
import { AuthService } from "@/modules/auth/services/auth.service";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/shared/utils/error.utils";

export const updateProfileAction = async (data: UpdateProfileDto) => {
  try {
    await UserService.updateProfile(data);
    
    const updatedUser = await AuthService.getCurrentUser();
    
    const cookieStore = await cookies();
    cookieStore.set("user_info", encodeURIComponent(JSON.stringify(updatedUser)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/profile");
    return { success: true, data: updatedUser };
  } catch (error) {
     return { success: false, error: getErrorMessage(error) };
  }
};

export const changePasswordAction = async (data: ChangePasswordDto) => {
  try {
    await UserService.changePassword(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
