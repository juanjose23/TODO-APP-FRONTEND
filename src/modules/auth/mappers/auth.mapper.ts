import { UserDto } from "../dto/user.dto";

interface RawUser {
  id?: number;
  uuid?: string;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  profile_photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export class AuthMapper {
  static toUserDto(data: RawUser): UserDto {
    return {
      id: String(data.id || data.uuid || ''),
      name: data.name,
      email: data.email,
      emailVerifiedAt: data.email_verified_at,
      avatar: data.avatar || data.profile_photo_url,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  }
}
