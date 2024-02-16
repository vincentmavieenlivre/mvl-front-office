import { log } from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";



export const test = onRequest({ cors: true }, (req, res) => {

    log("tests from .env TEST_VAR=", process.env.TEST_VAR, "NODE_ENV=", process.env.NODE_ENV);

    res.status(200).send({
        "data": "welcome ma vie en livre"
    });

});
