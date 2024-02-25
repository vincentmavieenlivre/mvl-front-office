import { AdminUser } from "./embedded/data-owner";

export interface Organization {
    id?: string;
    name: string;

    admins: AdminUser[]
}