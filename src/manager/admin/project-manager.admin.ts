import { ECollections } from "@app/modeles/database/firestore-collections";
import { Project } from "@app/modeles/database/project";
import { ERoles } from "@app/modeles/database/roles";
import { User } from "@app/modeles/database/user";
import { getFirestore } from "firebase-admin/firestore";

export class AdminProjectManager {


    constructor() {

    }

    async addUserOnProject(user: User, projectId: string, role: ERoles): Promise<Project | undefined> {

        console.log("[project add] params", user.email, " projectId=", projectId)

        if (!user.id) {
            throw ("no user id")
        }

        try {
            const projectRef = getFirestore().collection(ECollections.PROJECTS).doc(projectId)
            const doc = await projectRef.get();
            if (!doc.exists) {
                throw 'project does not exists'
            } else {
                console.log('Project data:', doc.data());
                const p: Project = doc.data() as Project

                p.owners.owner_ids.push(user.id)
                p.owners.users.push({
                    user_id: user.id,
                    user_name: user.name,
                    user_role: role
                })
                console.log("update project with", p)
                await getFirestore().collection(ECollections.PROJECTS).doc(projectId).set(p);

                return p
            }

        } catch (error) {
            console.error(error)
            console.log(error)
            return undefined
        }

    }


}