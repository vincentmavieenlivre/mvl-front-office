import { IBookQuestion } from "./book-question";



export interface IBookTemplate{
    id?:string;
    name:string; // mariage
    coverUrl?:string;

    questions?:IBookQuestion[] // store in sub collection
    questionsOrder?:{ index: number, id: string }[] // store in book template
}