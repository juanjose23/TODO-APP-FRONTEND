import api from "@/lib/axios";
import { UserDto } from "@/modules/auth/dto/user.dto";

export interface UpdateProfileDto {
  name: string;
  email: string;
}

export interface ChangePasswordDto {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export class UserService {
  private static readonly ROUTES = {
    UPDATE_PROFILE: "/user/profile-information", 
    CHANGE_PASSWORD: "/auth/user/password",
    GET_USER: "/auth/user",
  };

  /**
   * Update user profile information (name, email)
   */
  static async updateProfile(data: UpdateProfileDto): Promise<void> {
    await api.put(this.ROUTES.UPDATE_PROFILE, data);
  }

  /**
   * Change user password
   */
  static async changePassword(data: ChangePasswordDto): Promise<void> {
    await api.put(this.ROUTES.CHANGE_PASSWORD, data);
  }
}

