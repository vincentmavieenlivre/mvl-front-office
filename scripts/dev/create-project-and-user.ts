import { Project } from "@app/modeles/database/project";
import { db, scriptBootstrap } from "../bootstrap";
import { User } from "@app/modeles/database/user"
import { ERoles } from "@app/modeles/roles";
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper";
import { ECollections } from "@app/utils/firebase/firestore-collections";
scriptBootstrap()

if (!db) {
    throw 'db not init'
}

let user: User = {
    email: "user1@mvl.com",
    name: "user1"
}

let a = new FirestoreHelper()
await a.createNewDocument(db, ECollections.USERS, user)

if (!user.id) throw 'user null'

let project: Project = {
    name: "project 1",
    owners: {
        owner_ids: [user.id],
        users: [
            {
                user_id: user.id,
                user_name: user.name,
                user_role: ERoles.USER
            }
        ]
    }
}


await a.createNewDocument(db, ECollections.PROJECTS, project)

console.log("created user=", user, "project=", project)