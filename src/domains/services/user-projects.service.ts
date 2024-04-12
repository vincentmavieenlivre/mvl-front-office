import { db } from "@app/init/firebase"
import { BookTemplateManager } from "@app/manager/backoffice/book-template.manager"
import { IBookQuestion } from "@app/modeles/database/book/book-question"
import { IBookTemplate, IChapter } from "@app/modeles/database/book/book-template"
import { UserOwner } from "@app/modeles/database/embedded/data-owner"
import { Project } from "@app/modeles/database/project"
import { ERoles } from "@app/modeles/roles"
import { UserStore } from "@app/redux/auth.slice"
import { ECollections } from "@app/utils/firebase/firestore-collections"
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper"
import { IdTokenResult, User } from "firebase/auth"
import { ParsedToken } from "firebase/auth/cordova"
import { addDoc, collection, getDocs, query } from "firebase/firestore"
import _ from 'lodash';
export class UserProjectsService {

    private loadedProject: Project | undefined = undefined;

    constructor(private projectId: string) {

    }

    async loadQuestions(): Promise<IBookQuestion[]> {
        const collectionRef = collection(db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        const subcollectionQuery = query(collectionRef);

        const snapshot = await getDocs(subcollectionQuery);

        const questions: IBookQuestion[] = []

        snapshot.forEach((doc) => {
            const d: IBookQuestion = {
                ...doc.data(),
                id: doc.id
            } as unknown as IBookQuestion;

            questions.push(d)
        });


        // if there is an order : return sorted questions
        if (this.loadedProject?.questionsOrder && this.loadedProject?.questionsOrder.length > 0) {
            const sortedIds = this.loadedProject.questionsOrder?.sort((a, b) => {
                return a.index - b.index
            })

            const sortedQuestions: IBookQuestion[] = []
            if (sortedIds) {
                console.log("sorted", sortedIds.map((d) => d.id + " => " + d.index))
                console.log("questions", questions)
                for (const s of sortedIds) {
                    const q = questions.find((q) => q.template_question_id == s.id)
                    if (q) {
                        sortedQuestions.push(q)
                    } else {
                        console.warn("not found")
                    }
                }
                console.log("sorted final", sortedQuestions.map((d) => d.template_question_id))
                return sortedQuestions
            }
        }

        //return questions
    }


    public async loadProject(): Promise<Project> {
        const p = await FirestoreHelper.getDocument<Project>(db, ECollections.PROJECTS, this.projectId)
        this.loadedProject = p
        if (p) {
            return p
        } else {
            throw 'no project found for ' + this.projectId
        }
    }

    async createQuestionInProject(q: IBookQuestion) {
        const collectionRef = collection(db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        q.template_question_id = _.clone(q.id)
        delete q['id']
        const res = await addDoc(collectionRef, q);
        console.log("question saved => new ID=", res.id)
        q.id = res.id
    }


    static getUserProjects = async (user: UserStore) => {
        // if user is admin || user || family etc...


        const helper = new FirestoreHelper()
        console.log("db", db, "collection", ECollections.PROJECTS, "userid", user.user?.uid)
        const projects: Project[] = await helper.queryData<Project>(db, ECollections.PROJECTS, ["owners.owner_ids", "array-contains-any", [user.user?.uid]])

        console.log("[getUserProjects] num=", projects.length)

        return projects
    }

    static async createProject(projectName: string, creator: User, token: IdTokenResult, templateId: string): Promise<Project> {

        if (!creator.displayName || !creator.uid || !token.claims.role) {
            throw 'projectFactory one param is undefined'
        }

        if (!db) throw "database null"

        // the use who create
        const u: UserOwner = {
            user_name: creator.displayName,
            user_id: creator.uid,
            user_role: token.claims.role as ERoles
        }


        // get questions & order from template
        const templateManager = new BookTemplateManager(db, templateId)
        const sourceTemplate: IBookTemplate = await templateManager.loadTemplate()

        // the minimal project data
        const minimalData: Project = {
            name: projectName,
            owners: {
                owner_ids: [creator.uid],
                users: [u]
            },
            template_id: templateId,
            chapters: sourceTemplate.chapters
        }


        const questions: IBookQuestion[] = await templateManager.loadQuestions()


        // create the minimal project data
        const createdProject: Project = await new FirestoreHelper().createNewDocument(db, ECollections.PROJECTS, minimalData)



        // add all the questions (& order) to the created project
        if (createdProject.id) {
            const ups: UserProjectsService = new UserProjectsService(createdProject.id)

            // add questions
            for (const q of questions) {
                await ups.createQuestionInProject(q)
                createdProject.questions?.push(q)
            }

            // order
            minimalData.questionsOrder = sourceTemplate.questionsOrder

            // final update
            const updatedPrroject: Project = await new FirestoreHelper().updateDocument(db, ECollections.PROJECTS, createdProject.id, minimalData)
            console.log("updated project", updatedPrroject)
            return updatedPrroject

        }

    }

}