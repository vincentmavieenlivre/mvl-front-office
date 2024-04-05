import { db } from "@app/init/firebase";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { ECollections } from "@app/utils/firebase/firestore-collections";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";


export class UserProjectQuestionManager{

    constructor(public projectId:string, public question:IBookQuestion){

    }

    public async updateAudioUrl(audioUrl:string){
        const collectionRef = collection(db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, this.question.id)
        await updateDoc(documentRef, {
            audioUrl: audioUrl
        })
         
    }

}