import { CreateRequest, getAuth } from "firebase-admin/auth";
import { log } from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { ERoles } from "../../../src/modeles/roles";
import { User } from "../../../src/modeles/database/user";
import { ECollections } from "../../../src/utils/firebase/firestore-collections";
import { getFirestore } from 'firebase-admin/firestore';
import { AdminUserManager } from "../../../src/manager/admin/user.manager.admin";
import { AssemblyAI } from 'assemblyai';

export const speechToText = onRequest({ cors: true }, async (req, res) => {

    log("tests from .env TEST_VAR=", process.env.TEST_VAR, "NODE_ENV=", process.env.NODE_ENV);
    const client = new AssemblyAI({
        apiKey: '1466636c9dac4221a16d167e90d7b610',
    });

    let params = req.body.data
    log("audio url", params.audioUrl)

    const FILE_URL = params.audioUrl; 
    //"https://firebasestorage.googleapis.com/v0/b/front-office-staging-f55fa.appspot.com/o/mariage.webm?alt=media&token=16d4c1be-72de-44b6-bf00-d5ae1f2c49c4"
     

    const data = { audio_url: FILE_URL,   language_detection: true }

    const transcript = await client.transcripts.transcribe(data);
    
    res.status(200).send({
        data: { text: transcript.text }
    });

});
