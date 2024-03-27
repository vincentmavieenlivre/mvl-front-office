import { log } from "firebase-functions/logger";
import { onCall, onRequest } from "firebase-functions/v2/https";



export const renderPdfTest =  onCall({}, async(request) => {

    log("www [pdf] tests from .env TEST_VAR=", process.env.TEST_VAR, "NODE_ENV=", process.env.NODE_ENV);

   // call nestJs

});
