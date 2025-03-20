import { User } from './user.model';
import { Role } from "./role.model";
import { v4 as uuidv4 } from 'uuid';

export class UserRole {
    userId: string;
    roleId: string;
    role?: Role;

    constructor(userId?: string, roleId?: string, role?: Role) {
        this.userId = userId ?? uuidv4(); // Génère un GUID si non fourni
        this.roleId = roleId ?? uuidv4();
        this.role = role;
      }
}
