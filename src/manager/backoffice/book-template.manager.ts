

import { db } from "@app/init/firebase";
import { IBookQuestion, IBookQuestionEditable } from "@app/modeles/database/book/book-question";
import { IBookTemplate } from "@app/modeles/database/book/book-template";
import { ECollections } from "@app/utils/firebase/firestore-collections";
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper";
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";

export class BookTemplateManager{
    
    constructor(public db:Firestore, public templateId:string){
        
    }
    
    
    
    private  removeEditableFields = (q: IBookQuestionEditable): IBookQuestion => {
        let cleaned: IBookQuestion = {
            questionTitle: q.questionTitle
        }
        
        if (q.id) {
            cleaned.id = q.id
        }
        
        return cleaned
    }
    
    async loadTemplate():Promise<IBookTemplate>{
        const documentRef = doc(this.db, ECollections.BOOK_TEMPLATE, this.templateId)
        const docSnap = await getDoc(documentRef);
        
        if (docSnap.exists()) {
            return {
                ...docSnap.data(),
                id: docSnap.id
            } as unknown as IBookTemplate
        }else{
            throw 'no template found with id' + this.templateId
        } 
    }
    
    async loadQuestions():Promise<IBookQuestion[]>{
        let collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const subcollectionQuery = query(collectionRef);
        
        const snapshot = await getDocs(subcollectionQuery);
        
        let questions:IBookQuestion[] = []
        
        snapshot.forEach((doc) => {
            let d:IBookQuestion = {
                ...doc.data(),
                id: doc.id
            } as unknown as IBookQuestion;
            
            questions.push(d)
        });
        
        return questions
    }
    
    async createQuestionInTemplate(q:IBookQuestionEditable){
        let collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        let res = await addDoc(collectionRef, this.removeEditableFields(q));
        console.log("question saved => new ID=", res.id )
        q.id = res.id // the first time the question is created there is no "id" denormalized inside
        q.new = false
    }
    
    async updateQuestionInTemplate(q:IBookQuestionEditable){
        let collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, q.id)
        await updateDoc(documentRef, this.removeEditableFields(q) as any)
        console.log("question updated", q)
        q.changed = false
    }
    
    async deleteQuestionInTemplate(toDeleteId:string){
        let collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, toDeleteId)
        await deleteDoc(documentRef)
        console.log("[delete question]", toDeleteId)
    }
    
    
    // update ALL documents related to order
    async upsertQuestionsOrder(questions:IBookQuestionEditable[]){
        let order:{ index: number, id: string }[];
        order = questions.map((q:IBookQuestionEditable, index) => {    
            if(!q.id) throw "question have no id to save order"
            return { index: index, id: q.id}
        })
        
        let collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE);
        const documentRef = doc(collectionRef, this.templateId)
        await updateDoc(documentRef, {
            questionsOrder: order
        })
        console.log("save question order", order)
        
    }
    
    
}