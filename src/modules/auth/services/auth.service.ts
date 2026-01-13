import api from "@/lib/axios";
import { AuthResponseDto, LoginDto, RegisterDto, UserDto } from "../dto/user.dto";

interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}

export class AuthService {
  private static readonly ROUTES = {
    LOGIN: "/auth/oauth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    USER: "/auth/user", 
    REFRESH: "/auth/oauth/refresh",
    CHANGE_PASSWORD: "/auth/user/password/update",
  };

  static async login(credentials: LoginDto): Promise<AuthResponseDto> {
    const response = await api.post<BackendAuthResponse>(this.ROUTES.LOGIN, credentials);
    return this.mapResponse(response.data);
  }

  static async register(data: RegisterDto): Promise<AuthResponseDto> {
    const response = await api.post<BackendAuthResponse>(this.ROUTES.REGISTER, data);
    return this.mapResponse(response.data);
  }

  static async logout(): Promise<void> {
    await api.post(this.ROUTES.LOGOUT);
  }

  static async logoutAll(): Promise<void> {
    await api.post(this.ROUTES.LOGOUT_ALL);
  }

  static async getCurrentUser(token?: string): Promise<UserDto> {
    let authToken = token;
    
    if (!authToken && typeof window !== 'undefined') {
        authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
    }

    if (!authToken) {
       throw new Error("No authentication token found");
    }

    const userId = this.getUserIdFromToken(authToken);
    if (!userId) throw new Error("No user ID found in token");

    try {
        const response = await api.get<{ user: UserDto }>(`${this.ROUTES.USER}/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        // If the API returns the user wrapped in a 'user' property (like in login)
        const userData = response.data.user || response.data;
        return this.ensureAvatar(userData as UserDto);
    } catch (error) {
        console.error(`[AuthService] Error fetching user ${userId}:`, error);
        throw error;
    }
  }

  static getUserIdFromToken(token: string): string {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      let jsonPayload;
      if (typeof window !== 'undefined') {
          jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
      } else {
          jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      }
      
      const payload = JSON.parse(jsonPayload);
      // Based on the token payload provided by the user, the ID is in the 'sub' field
      return payload.sub || payload.id || payload.user_id || "";
    } catch (error) {
      console.error("Failed to decode token:", error);
      return "";
    }
  }

  static async refreshToken(token: string): Promise<AuthResponseDto> {
    const response = await api.post<BackendAuthResponse>(this.ROUTES.REFRESH, { token });
    return this.mapResponse(response.data);
  }

  static async verifyEmail(url: string): Promise<void> {
    await api.get(url);
  }

  static async resendVerificationEmail(email: string): Promise<void> {
    await api.post("/auth/resend-email", { email });
  }

  private static mapResponse(data: BackendAuthResponse): AuthResponseDto {
    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user: this.ensureAvatar(data.user),
    };
  }

  private static ensureAvatar(user: UserDto): UserDto {
    if (!user.avatar) {
      const name = encodeURIComponent(user.name);
      return {
        ...user,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`,
      };
    }
    return user;
  }
}
