"use server";

import { cookies } from "next/headers";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterDto } from "../dto/user.dto";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { getErrorMessage } from "@/shared/utils/error.utils";

export const loginAction = async (credentials: LoginDto) => {
  try {
    const response = await AuthService.login(credentials);
    
    const cookieStore = await cookies();
    cookieStore.set("auth_token", response.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("refresh_token", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    cookieStore.set("user_info", encodeURIComponent(JSON.stringify(response.user)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, data: response.user };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

export const registerAction = async (data: RegisterDto) => {
  try {
    const response = await AuthService.register(data);
    
    const cookieStore = await cookies();
    cookieStore.set("auth_token", response.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("refresh_token", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    cookieStore.set("user_info", encodeURIComponent(JSON.stringify(response.user)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, data: response.user };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
      await AuthService.logout();
    }

    deleteAuthCookies(cookieStore);
    return { success: true };
  } catch (error) {
    const cookieStore = await cookies();
    deleteAuthCookies(cookieStore);
    return { success: false, error: "Error al cerrar sesión" };
  }
};

export const verifyEmailAction = async (url: string) => {
  try {
    await AuthService.verifyEmail(url);
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

export const resendEmailAction = async (email: string) => {
  try {
    await AuthService.resendVerificationEmail(email);
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

const deleteAuthCookies = (cookieStore: ReadonlyRequestCookies) => {
  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_info");
};


