import { IBookFor } from "./book-target";
import { IQuestionsContainer } from "./book/book-template";
import { DataOwner } from "./embedded/data-owner";

export interface Project extends IQuestionsContainer {
    id?: string;
    owners: DataOwner;
    name: string;
    template_id: string;
    templateCoverUrl: string;

    bookFor?: IBookFor;

}