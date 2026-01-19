export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'guest' | 'owner';
  is_active: boolean;
  date_joined: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  user_type?: 'guest' | 'owner';
}

export interface AuthResponse {
  access: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}
