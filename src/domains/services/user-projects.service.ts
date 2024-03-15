import { db } from "@app/init/firebase"
import { BookTemplateManager } from "@app/manager/backoffice/book-template.manager"
import { IBookQuestion } from "@app/modeles/database/book/book-question"
import { IBookTemplate } from "@app/modeles/database/book/book-template"
import { UserOwner } from "@app/modeles/database/embedded/data-owner"
import { Project } from "@app/modeles/database/project"
import { ERoles } from "@app/modeles/roles"
import { UserStore } from "@app/redux/auth.slice"
import { ECollections } from "@app/utils/firebase/firestore-collections"
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper"
import { IdTokenResult, User } from "firebase/auth"
import { ParsedToken } from "firebase/auth/cordova"
import { addDoc, collection } from "firebase/firestore"
import _ from 'lodash';
export class UserProjectsService {
    
    constructor(private projectId:string){
        
    }
    
    async createQuestionInProject(q:IBookQuestion){
        let collectionRef = collection(db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        q.template_question_id = _.clone(q.id)
        delete q['id']
        let res = await addDoc(collectionRef, q);
        console.log("question saved => new ID=", res.id )
        q.id = res.id         
    }
    
    
    static getUserProjects = async (user: UserStore) => {
        // if user is admin || user || family etc...
        
        
        let helper = new FirestoreHelper()
        console.log("db", db, "collection", ECollections.PROJECTS, "userid", user.user?.uid)
        let projects: Project[] = await helper.queryData<Project>(db, ECollections.PROJECTS, ["owners.owner_ids", "array-contains-any", [user.user?.uid]])
        
        console.log("[getUserProjects] num=", projects.length)
        
        return projects
    }
    
    static async createProject(projectName: string, creator: User, token: IdTokenResult, templateId:string): Promise<Project> {
        
        if (!creator.displayName || !creator.uid || !token.claims.role) {
            throw 'projectFactory one param is undefined'
        }
        
        if(!db) throw "database null"
        
        // the use who create
        let u: UserOwner = {
            user_name: creator.displayName,
            user_id: creator.uid,
            user_role: token.claims.role as ERoles
        }
        
        // the minimal project data
        let p: Project = {
            name: projectName,
            owners: {
                owner_ids: [creator.uid],
                users: [u]
            },
            template_id: templateId            
        }
        
        // create the minimal project data
        let createdProject:Project = await new FirestoreHelper().createNewDocument(db, ECollections.PROJECTS, p)
        
        // get questions & order from template
        let templateManager = new BookTemplateManager(db, templateId)        
        let sourceTemplate:IBookTemplate = await templateManager.loadTemplate()
        let questions:IBookQuestion[] = await templateManager.loadQuestions()
        
        // add all the questions (& order) to the created project
        if(createdProject.id){
            let ups:UserProjectsService =  new UserProjectsService(createdProject.id)
            
            // add questions
            for(let q of questions){
                await ups.createQuestionInProject(q)
                createdProject.questions?.push(q)
            }
    
            // order
            p.questionsOrder = sourceTemplate.questionsOrder

            // final update
            let updatedPrroject:Project = await new FirestoreHelper().updateDocument(db, ECollections.PROJECTS, createdProject.id, p)
            console.log("updated project", updatedPrroject)
            return updatedPrroject   

        }
                                    
    }
    
}