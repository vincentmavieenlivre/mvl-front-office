import { db } from "@app/init/firebase";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { IResponse } from "@app/modeles/database/book/response";
import { ECollections } from "@app/modeles/database/firestore-collections";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";


export class UserProjectQuestionManager {

    constructor(public projectId: string, public question: IBookQuestion) {

    }

    public async updateAudioUrl(audioUrl: string) {
        const collectionRef = collection(db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, this.question.id)
        await updateDoc(documentRef, {
            audioUrl: audioUrl
        })
    }

    public async updateAllResponses(responses: IResponse[]): Promise<any> {
        const collectionRef = collection(db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, this.question.id)
        await updateDoc(documentRef, {
            responses: responses.map((r: IResponse) => {
                return {
                    id: r.id,
                    audioRecord: {
                        audioUrl: r.audioRecord.audioUrl
                    },
                    text: r.text
                }
            })
        })
    }

}