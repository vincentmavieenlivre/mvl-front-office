export interface IBookQuestion{

    id?:string;
    questionTitle:string;

}


export interface IBookQuestionEditable extends IBookQuestion{
    new?:boolean; // if new
    changed?:boolean; // if content has changed
}