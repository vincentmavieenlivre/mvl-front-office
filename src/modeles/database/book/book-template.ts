import { IBookQuestion } from "./book-question";



export interface IQuestionsContainer{
    questions?:IBookQuestion[] // stored in sub collection
    questionsOrder?:{ index: number, id: string }[] // stored in container collection
}

export interface IBookTemplate extends IQuestionsContainer{
    id?:string;
    name:string; // mariage
    coverUrl?:string;    
}