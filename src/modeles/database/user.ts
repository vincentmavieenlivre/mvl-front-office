import { ERoles } from "./roles";

export interface User {
    id?: string;
    name: string;
    email: string;
    role: ERoles
}