export function canAccessTenant(
  user: { isSuperAdmin: boolean; tenantId: string },
  tenantId: string,
): boolean {
  return user.isSuperAdmin || user.tenantId === tenantId;
}
