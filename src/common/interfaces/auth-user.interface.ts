export interface AuthUser {
  userId: string;
  organizationId: string;
  email: string;
  roles: string[];
  permissions: string[];
}
