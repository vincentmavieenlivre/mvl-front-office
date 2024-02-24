import { DataOwner } from "./embedded/data-owner";

export interface Project {
    owners: DataOwner;
    name: string;

}