// Роли админки (RBAC). admin — полный доступ (удаление, управление юзерами);
// editor — контент без удаления и без управления пользователями.

export const ROLES = ["admin", "editor"] as const;
export type Role = (typeof ROLES)[number];

export interface AdminUser {
    id: string;
    email: string;
    name?: string;
    role: Role;
    createdAt: string;
}
