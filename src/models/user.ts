export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum MembershipRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  isSuperAdmin?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string;
  isSuperAdmin: boolean;
}

export interface JwtUser {
  userId: string;
  email: string;
  role: UserRole;
  tenantId: string;
  isSuperAdmin: boolean;
}

export interface TenantInfo {
  id: string;
  slug: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  tenant: TenantInfo;
}

export type RequestWithUser = import('express').Request & {
  user?: JwtUser;
  tenant?: TenantInfo;
  tenantSlug?: string;
};
