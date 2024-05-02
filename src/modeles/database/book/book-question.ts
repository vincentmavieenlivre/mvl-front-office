import { IResponse } from "@app/pages/app/projects/questions/show.question";

export interface IBookQuestion {

    id?: string;
    questionTitle: string;
    template_question_id?: string // reference when stored in project collection (null in template collection)    
    chapterId?: string;
    responses?: IResponse[]
}


export interface IBookQuestionEditable extends IBookQuestion {
    new?: boolean; // if new
    changed?: boolean; // if content has changed
}