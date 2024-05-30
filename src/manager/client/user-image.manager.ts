import { BookImage, EImageKind } from "@app/components/app/summary/summary";
import { UserProjectsService } from "@app/domains/services/user-projects.service";
import { db, storage } from "@app/init/firebase";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { IResponse } from "@app/modeles/database/book/response";
import { ECollections } from "@app/modeles/database/firestore-collections";
import { setChapterTree, setQuestion, updateChapter, updateChapters } from "@app/redux/current.project.slice";
import { getChapterTree } from "@app/redux/helpers/project.slice.helpers";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";

import { store } from "@app/redux/store"
import { UserProjectQuestionManager } from "./user-project-question.manager";
export class UserImageManager {

    constructor(
        private image: BookImage) {
    }

    public async updateImageQuestion(): Promise<any> {
        // 1 save the image
        let imageUrl = await this.uploadImage()

        if (this.image.question?.id && imageUrl) {
            // 2 save the image url in question
            let m = new UserProjectQuestionManager(this.image.projectId, this.image.question)
            let res = await m.updateQuestionImage(imageUrl)

            // 3 save into store
            store.dispatch(setQuestion({ ...this.image.question, pictureUrl: imageUrl }))
        }

    }

    private uploadImage = async () => {
        if (!storage) return

        let file = this.image.selectedImage

        const metadata = {
            contentType: 'image/png'
        }

        let imageRef

        switch (this.image.imageKind) {
            case EImageKind.QUESTION:
                imageRef = ref(storage, `projects/${this.image.projectId}/questions/question-${this.image.question?.id}-image.png`);
                break;
            case EImageKind.CHAPTER:
                imageRef = ref(storage, `projects/${this.image.projectId}/chapters/chapter-${this.image.chapterId}-image.png`);
                break;
            case EImageKind.BOOK_DESTINATION_AVATAR:
                imageRef = ref(storage, `projects/${this.image.projectId}/destination-avatar-image.png`);
                break;
            default:
                console.error("upload image should never happen")
                break;
        }

        try {
            if (imageRef) {
                if (file) {
                    const base64Data = file.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                    const resSnapshot = await uploadString(imageRef, base64Data, 'base64')

                    const downloadURL = await getDownloadURL(resSnapshot.ref)
                    return downloadURL
                } else {
                    console.error("file null")
                }
            }
        } catch (e) {
            console.error("when uploading image")
        }
    };


    public async updateImageChapter(): Promise<any> {

        // TODO use store !!!
        let s = new UserProjectsService(this.image.projectId, db)
        let p = await s.loadProject(db)

        let chapterFound = p.chapters.find((c) => c.id == this.image.chapterId)
        if (chapterFound) {

            // 1 save the image
            let imageUrl = await this.uploadImage()
            chapterFound.pictureUrl = imageUrl


            // 2 save the image url in chapter
            const collectionRef = collection(db, ECollections.PROJECTS);
            const projectRef = doc(collectionRef, this.image.projectId)

            await updateDoc(projectRef, {
                chapters: p.chapters
            })

            // 3 refresh the store
            store.dispatch(updateChapters(p.chapters))

        }



    }

    public async uploadDestinationAvatar(): Promise<any> {
        // 1 save the image
        let imageUrl = await this.uploadImage()

        if (this.image && db && imageUrl) {
            await UserProjectsService.updateDestinationAvatarUrl(db, imageUrl, this.image.projectId)
            return imageUrl
        }

    }

}