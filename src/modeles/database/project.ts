import { DataOwner } from "./embedded/data-owner";

export interface Project {
    id?: string;
    owners: DataOwner;
    name: string;

}