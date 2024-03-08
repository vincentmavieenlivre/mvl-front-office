import { db } from "@app/init/firebase"
import { UserOwner } from "@app/modeles/database/embedded/data-owner"
import { Project } from "@app/modeles/database/project"
import { ERoles } from "@app/modeles/roles"
import { UserStore } from "@app/redux/auth.slice"
import { ECollections } from "@app/utils/firebase/firestore-collections"
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper"
import { IdTokenResult, User } from "firebase/auth"
import { ParsedToken } from "firebase/auth/cordova"

export class UserProjectsService {

    static getUserProjects = async (user: UserStore) => {
        // if user is admin || user || family etc...


        let helper = new FirestoreHelper()
        console.log("db", db, "collection", ECollections.PROJECTS, "userid", user.user?.uid)
        let projects: Project[] = await helper.queryData<Project>(db, ECollections.PROJECTS, ["owners.owner_ids", "array-contains-any", [user.user?.uid]])

        console.log("[getUserProjects] num=", projects.length)

        return projects
    }

    static projectFactory(projectName: string, creator: User, token: IdTokenResult): Project {

        if (!creator.displayName || !creator.uid || !token.claims.role) {
            throw 'projectFactory one param is undefined'
        }

        let u: UserOwner = {
            user_name: creator.displayName,
            user_id: creator.uid,
            user_role: token.claims.role as ERoles
        }

        let p: Project = {
            name: projectName,
            owners: {
                owner_ids: [creator.uid],
                users: [u]
            }
        }

        return p

    }

}