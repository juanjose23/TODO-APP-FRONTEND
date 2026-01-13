import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/modules/auth/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
    }

    const response = await AuthService.refreshToken(refreshToken);

    cookieStore.set("auth_token", response.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("refresh_token", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ token: response.token });
  } catch (error: any) {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_info");

    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 401 }
    );
  }
}
