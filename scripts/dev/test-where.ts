
import { db, scriptBootstrap } from "../bootstrap";
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper";

scriptBootstrap()

import { collection, query, where, getDocs } from "firebase/firestore";

console.log("1 ->")
const q = query(collection(db, "project"), where("owners.owner_ids", "array-contains", "ob6D4CfYdUej93uACRNq"));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
});

console.log("2 ->")
const q2 = query(collection(db, "project"), where("owners.owner_ids", "array-contains-any", ["ob6D4CfYdUej93uACRNq"]));

const querySnapshot2 = await getDocs(q2);
querySnapshot2.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
});