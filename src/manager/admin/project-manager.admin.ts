import { Project } from "@app/modeles/database/project";
import { User } from "@app/modeles/database/user";
import { ECollections } from "@app/utils/firebase/firestore-collections";
import { getFirestore } from "firebase-admin/firestore";
import { log } from "firebase-functions/logger";

export  class AdminProjectManager {
    
    public userId:string|undefined
    
    constructor() {
        
    }
    
    async addUserOnProject(user:User, projectId: string): Promise<Project|undefined> {
        log("[project add] params", user.email, " projectId=", projectId)
        
        if(!user.id){
            throw("no user id")
        }        
        
        try {
            const projectRef = getFirestore().collection(ECollections.PROJECTS).doc(projectId)
            const doc = await projectRef.get();
            if (!doc.exists) {
                throw 'project does not exists'
            } else {
                log('Document data:', doc.data());
                let p:Project = doc.data() as Project
                
                p.owners.owner_ids.push(user.id)
                p.owners.users.push({
                    user_id: user.id,
                    user_name: user.name,
                    user_role: user.role
                })
                log("update project with", p)
                await getFirestore().collection(ECollections.PROJECTS).doc(projectId).set(p);
                
                return p
            }
            
        } catch (error) {
            console.error(error)    
            log(error)            
            return undefined
        }
       
    }
    
    
}