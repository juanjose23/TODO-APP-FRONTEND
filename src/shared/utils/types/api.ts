export interface Paginated<T> {
  items: T[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface ApiError {
  message?: string;
  error?: string;
  code?: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Respuesta de registro de usuario
export interface RegisterUserResponse extends ApiResponse<User> {
  message: string; // "User successfully registered"
}
