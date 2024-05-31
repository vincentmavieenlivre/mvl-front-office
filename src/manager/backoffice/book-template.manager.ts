

import { IBookQuestion, IBookQuestionEditable } from "@app/modeles/database/book/book-question";
import { IBookTemplate, IChapter } from "@app/modeles/database/book/book-template";
import { ECollections } from "@app/modeles/database/firestore-collections";
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";

export class BookTemplateManager {

    private template: IBookTemplate | undefined

    constructor(public db: Firestore, public templateId: string) {

    }


    public static async loadAllTemplates(db: Firestore): Promise<IBookTemplate[]> {

        const q = query(collection(db, ECollections.BOOK_TEMPLATE));
        const docSnaps = await getDocs(q);

        const res: IBookTemplate[] = []

        docSnaps.forEach((doc) => {
            res.push({
                ...doc.data(),
                id: doc.id
            } as unknown as IBookTemplate)
        })
        return res
    }

    async loadTemplate(): Promise<IBookTemplate> {
        const documentRef = doc(this.db, ECollections.BOOK_TEMPLATE, this.templateId)
        const docSnap = await getDoc(documentRef);

        if (docSnap.exists()) {
            this.template = {
                ...docSnap.data(),
                id: docSnap.id
            } as unknown as IBookTemplate
            this.template.id = this.templateId as string
            return this.template
        } else {
            throw 'no template found with id' + this.templateId
        }
    }

    async loadQuestions(): Promise<IBookQuestion[]> {
        const collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const subcollectionQuery = query(collectionRef);

        const snapshot = await getDocs(subcollectionQuery);

        const questions: IBookQuestion[] = []

        snapshot.forEach((doc) => {
            const d: IBookQuestion = {
                ...doc.data(),
                id: doc.id
            } as unknown as IBookQuestion;

            questions.push(d)
        });

        // if there is an order : return sorted questions
        if (this.template?.questionsOrder && this.template?.questionsOrder.length > 0) {
            const sortedIds = this.template.questionsOrder?.sort((a, b) => {
                return a.index - b.index
            })

            const sortedQuestions: IBookQuestion[] = []
            if (sortedIds) {
                for (const s of sortedIds) {
                    const q = questions.find((q) => q.id == s.id)
                    if (q) {
                        sortedQuestions.push(q)
                    }
                }

                return sortedQuestions
            }
        }

        return questions
    }

    private removeEditableFields = (q: IBookQuestionEditable): IBookQuestion => {
        const cleaned: IBookQuestion = {
            questionTitle: q.questionTitle,
            chapterId: q.chapterId
        }

        if (q.id) {
            cleaned.id = q.id
        }

        return cleaned
    }





    async createQuestionInTemplate(q: IBookQuestionEditable) {
        const collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const res = await addDoc(collectionRef, this.removeEditableFields(q));
        console.log("question saved => new ID=", res.id)
        q.id = res.id // the first time the question is created there is no "id" denormalized inside
        q.new = false
    }

    async updateQuestionPictureInTemplate(question: IBookQuestionEditable, pictureUrl: string) {
        const collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, question.id)
        await updateDoc(documentRef, { pictureUrl: pictureUrl })
    }

    async updateQuestionInTemplate(q: IBookQuestionEditable) {
        const collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, q.id)
        await updateDoc(documentRef, this.removeEditableFields(q) as any)
        q.changed = false
    }

    async deleteQuestionInTemplate(toDeleteId: string) {
        const collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE, this.templateId, ECollections.QUESTIONS);
        const documentRef = doc(collectionRef, toDeleteId)
        await deleteDoc(documentRef)
        console.log("[delete question]", toDeleteId)
    }


    // update ALL documents related to order
    async upsertTemplate(questions: IBookQuestionEditable[], coverUrl: string | undefined = undefined, chapters: IChapter[]) {
        let order: { index: number, id: string }[];
        order = questions.map((q: IBookQuestionEditable, index) => {
            if (!q.id) throw "question have no id to save order"
            return { index: index, id: q.id }
        })

        const collectionRef = collection(this.db, ECollections.BOOK_TEMPLATE);
        const documentRef = doc(collectionRef, this.templateId)

        const finalDoc: any = {
            questionsOrder: order,
            chapters: chapters
        }

        if (coverUrl) {
            finalDoc['coverUrl'] = coverUrl
        }

        await updateDoc(documentRef, finalDoc)
        console.log("save question order", order)

    }


}