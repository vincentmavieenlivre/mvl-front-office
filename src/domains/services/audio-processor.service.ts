import { functions, storage } from "@app/init/firebase";
import { UserProjectQuestionManager } from "@app/manager/client/user-project-question.manager";
import { IEntry } from "@app/pages/app/projects/questions/show.question";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const audioMimeType = "audio/webm";


export class AudioProcessor {

    private entry: IEntry;
    private remoteAudioUrl: string | undefined;

    constructor(
        private projectId: string,
        private questionId: string,
        entry: IEntry) {
        this.entry = entry
    }

    public getEntry(): IEntry {
        return this.entry
    }


    public async upload(): Promise<any> {
        if (!storage) return

        const metadata = {
            contentType: audioMimeType
        }

        // console.log("<Audiorecorder> uploadAudioOnStorage")
        const audioStorageRef = ref(storage, `projects/${this.projectId}/questions/${this.questionId}/answer.webm`);

        try {
            console.log("custom upload go for", this.entry.audioRecord)
            const resSnapshot = await uploadBytes(audioStorageRef, this.entry.audioRecord.audioBlob)
            console.log('Uploaded the audio blob', resSnapshot);

            const downloadURL = await getDownloadURL(resSnapshot.ref)
            console.log('audio file available at', downloadURL);

            /*  const qm = new UserProjectQuestionManager(this.projectId, this.question)
             const audioUrl: string = await qm.updateAudioUrl(downloadURL)
             console.log("audio url", audioUrl)
  */
            this.remoteAudioUrl = downloadURL

            return downloadURL
        } catch (e) {
            console.error(e)
        }
    }

    public async transcribe(): Promise<any> {
        if (functions) {
            const transcribeFromCloudFunction = httpsCallable(functions, 'speechToText');
            const result = await transcribeFromCloudFunction({ audioUrl: this.remoteAudioUrl })
            this.entry.text = (result.data as any)?.text as string
            console.log("[transcripted text]", this.entry.text)
            return this.transcribedText
        }
    }



}