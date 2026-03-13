export enum UserRole {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  STUDENT = 'STUDENT',
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface JwtUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export type RequestWithUser = Request & { user?: RequestUser };
