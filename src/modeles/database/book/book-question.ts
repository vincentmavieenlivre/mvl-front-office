export interface IBookQuestion{

    id?:string;
    questionTitle:string;
    template_question_id?:string // reference when stored in project collection (null in template collection)
    audioUrl?:string
}


export interface IBookQuestionEditable extends IBookQuestion{
    new?:boolean; // if new
    changed?:boolean; // if content has changed
}