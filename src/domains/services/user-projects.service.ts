

import { IBookTemplate, IChapter, IChapterTree } from "@app/modeles/database/book/book-template"
import { UserOwner } from "@app/modeles/database/embedded/data-owner"
import { Project } from "@app/modeles/database/project"
import { ERoles } from "@app/modeles/database/roles"
import { IdTokenResult, User } from "firebase/auth"
import { Firestore, addDoc, collection, getDocs, query } from "firebase/firestore"
import { clone } from 'lodash';
import { sortQuestions } from "@app/redux/helpers/project.slice.helpers"

import { BookTemplateManager } from "@app/manager/backoffice/book-template.manager"
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper"
import { ECollections } from "@app/modeles/database/firestore-collections"
import { IBookQuestion } from "@app/modeles/database/book/book-question"
import { EBookDestination, IBookFor } from "@app/modeles/database/book-target"


export class UserProjectsService {

    private loadedProject: Project | undefined = undefined;
    private questons: IBookQuestion[] = []

    constructor(private projectId: string, private db: Firestore) {

    }



    getQuestionsByChapters(sortedQuestions: IBookQuestion[]): IChapterTree[] {
        let chapters: IChapterTree[] = []

        if (this.loadedProject?.chapters && this.loadedProject?.chapters.length > 0) {
            this.loadedProject?.chapters.forEach((c: IChapter) => {
                let questions = sortedQuestions.filter((q: IBookQuestion) => q.chapterId === c.id)
                if (questions) {
                    chapters.push({
                        ...c,
                        orderedQuestions: questions
                    } as IChapterTree)
                }
            })
        }
        return chapters
    }

    async loadQuestions(): Promise<IBookQuestion[]> {
        const collectionRef = collection(this.db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
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

        return sortQuestions(this.loadedProject?.questionsOrder, questions)
    }


    public async loadProject(db: Firestore): Promise<Project> {
        console.log("firestore", this.projectId)
        const p = await FirestoreHelper.getDocument<Project>(db, ECollections.PROJECTS, this.projectId)
        console.log("[loaded project]", p)
        this.loadedProject = p
        if (p) {
            return p
        } else {
            throw 'no project found for ' + this.projectId
        }
    }

    async createQuestionInProject(q: IBookQuestion) {
        const collectionRef = collection(this.db, ECollections.PROJECTS, this.projectId, ECollections.QUESTIONS);
        q.template_question_id = clone(q.id)
        delete q['id']
        const res = await addDoc(collectionRef, q);
        console.log("question saved => new ID=", res.id)
        q.id = res.id
    }


    static getUserProjects = async (db: Firestore, userUid: string) => {
        // if user is admin || user || family etc...


        const helper = new FirestoreHelper()
        console.log("db", db, "collection", ECollections.PROJECTS, "userid", userUid)
        const projects: Project[] = await helper.queryData<Project>(db, ECollections.PROJECTS, ["owners.owner_ids", "array-contains-any", [userUid]])

        console.log("[getUserProjects] num=", projects)

        return projects
    }

    static async updateProjectBookFor(db: Firestore, bookFor: IBookFor, projectId: string): Promise<boolean> {
        await new FirestoreHelper().updateDocument(db, ECollections.PROJECTS, projectId, {
            "bookFor": bookFor
        })
        return true
    }

    static async updateDestinationAvatarUrl(db: Firestore, destinationAvatarUrl: string, projectId: string): Promise<boolean> {
        await new FirestoreHelper().updateDocument(db, ECollections.PROJECTS, projectId, {
            "bookFor.avatarUrl": destinationAvatarUrl
        })
        return true
    }

    static async updateProjectDestination(db: Firestore, destination: EBookDestination, projectId: string): Promise<boolean> {
        await new FirestoreHelper().updateDocument(db, ECollections.PROJECTS, projectId, {
            "bookFor.destination": destination
        })
        return true
    }

    static async createProject(db: Firestore, projectName: string, creator: User, token: IdTokenResult, template: IBookTemplate): Promise<Project> {

        if (!creator.displayName || !creator.uid || !token.claims.role) {
            throw 'projectFactory one param is undefined'
        }

        if (!template.id) {
            throw "template id is null"
        }

        if (!db) throw "database null"

        // the use who create
        const u: UserOwner = {
            user_name: creator.displayName,
            user_id: creator.uid,
            user_role: token.claims.role as ERoles
        }


        // get questions & order from template
        const templateManager = new BookTemplateManager(db, template.id)
        const sourceTemplate: IBookTemplate = await templateManager.loadTemplate()

        // the minimal project data
        const minimalData: Project = {
            name: projectName,
            owners: {
                owner_ids: [creator.uid],
                users: [u]
            },
            template_id: template.id,
            templateCoverUrl: sourceTemplate.coverUrl ?? '',
            chapters: sourceTemplate.chapters,
            stats: {
                numAnswered: 0,
                totalQuestions: template.questionsOrder?.length ?? -1
            }
        }


        const questions: IBookQuestion[] = await templateManager.loadQuestions()


        // create the minimal project data
        const createdProject: Project = await new FirestoreHelper().createNewDocument(db, ECollections.PROJECTS, minimalData)



        // add all the questions (& order) to the created project
        if (createdProject.id) {
            const ups: UserProjectsService = new UserProjectsService(createdProject.id, db)

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