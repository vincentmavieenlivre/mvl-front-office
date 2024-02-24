import { Project } from "@app/modeles/database/project";
import { db, scriptBootstrap } from "../bootstrap";
import { User } from "@app/modeles/database/user"
import { ERoles } from "@app/modeles/roles";
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper";
import { ECollections } from "@app/utils/firebase/firestore-collections";
import { Organization } from "@app/modeles/database/organization";
scriptBootstrap()

if (!db) {
    throw 'db not init'
}

let user: User = {
    email: "user1@mvl.com",
    name: "user1"
}

let helper = new FirestoreHelper()
await helper.createNewDocument(db, ECollections.USERS, user)

if (!user.id) throw 'user null'

let project: Project = {
    name: "project 2",
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


await helper.createNewDocument(db, ECollections.PROJECTS, project)

if (!project.id) throw 'project null'

let orga: Organization = {
    name: "Elsan"
}

await helper.createNewDocument(db, ECollections.ORGANIZATION, orga)

project.owners.organisation_id = orga.id
project.owners.organisation_name = orga.name
await helper.updateDocument(db, "project", project.id, project)



console.log("created user=", user, "project=", project, "orga=", orga)