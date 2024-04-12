import { IBookQuestion } from "./book-question";

export interface IChapter {
    id?: string;
    name: string; //firebase.firestore.FieldValue.id();
    index: number
}


export interface IQuestionsContainer {
    questions?: IBookQuestion[] // stored in sub collection
    questionsOrder?: { index: number, id: string }[] // stored in container collection
    chapters: IChapter[]
}

export interface IBookTemplate extends IQuestionsContainer {
    id?: string;
    name: string; // mariage
    coverUrl?: string;
}


export interface IChapterQuestions extends IChapter {
    orderedQuestions?: IBookQuestion[] // stored in sub collection
}
