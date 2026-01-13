export interface UserDto {
  id: number | string;
  name: string;
  email: string;
  emailVerifiedAt?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
