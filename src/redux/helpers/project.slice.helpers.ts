import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { IChapter, IChapterTree } from "@app/modeles/database/book/book-template";
import { Project } from "@app/modeles/database/project";
import { ERoles } from "@app/modeles/database/roles";

export interface IProjectStats {
    totalQuestions: number;
    numAnswered: number
}
export interface IActionProjectStatsUpdate extends IProjectStats {
    projectId?: string;
}

export interface IActionImageCoverUpdate {
    projectId: string;
    coverUrl: string
}

export interface IActionNameUpdate {
    projectId: string;
    name: string
}

export function getAnsweredStats(questions: IBookQuestion[]): IProjectStats {

    let totalAnswered = questions.reduce((ac: number, current: IBookQuestion) => {
        if (current?.responses == undefined) {
            return ac
        }
        return current?.responses?.length > 0 ? ac + 1 : ac
    }, 0)

    return {
        numAnswered: totalAnswered,
        totalQuestions: questions.length
    }
}


export function getUserStatusOnProject(project: Project, userId: string): string | null {
    const u = project.owners.users.find((u) => u.user_id == userId)
    if (u) {
        switch (u.user_role) {
            case ERoles.INVITED:
                return "visiteur"
            case ERoles.USER:
                return null
            default:
                throw 'user not on project'
        }
    }
    return null
}

export function sortQuestions(questionsOrder: { index: number, id: string }[], questions: IBookQuestion[]): IBookQuestion[] {

    // if there is an order : return sorted questions

    if (questionsOrder && questionsOrder.length > 0 && questions.length > 0) {

        let sortedIds = [...questionsOrder]?.sort((a, b) => {
            return a.index - b.index
        })

        const sortedQuestions: IBookQuestion[] = []
        if (sortedIds) {
            for (const s of sortedIds) {
                const q = questions.find((q) => q.template_question_id == s.id)
                if (q) {
                    sortedQuestions.push(q)
                }
            }
            return sortedQuestions
        }
    }
    return []
}


export function getChapterTree(project: Project): IChapterTree[] | undefined {
    let chapters: IChapterTree[] = []

    if (project?.chapters && project?.chapters.length > 0) {
        let sortedQuestions = sortQuestions(project?.questionsOrder, project?.questions)

        project?.chapters.forEach((c: IChapter) => {
            let questions = sortedQuestions.filter((q: IBookQuestion) => q.chapterId === c.id)
            if (questions) {
                chapters.push({
                    ...c,
                    orderedQuestions: questions
                } as IChapterTree)
            }
        })
    }
    //console.log("by chapters", JSON.stringify(chapters))
    return chapters

}