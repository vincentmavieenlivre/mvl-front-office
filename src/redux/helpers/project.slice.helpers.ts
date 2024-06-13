import { IBookQuestion } from "@app/modeles/database/book/book-question"
import { IChapter, IChapterTree } from "@app/modeles/database/book/book-template"
import { Project } from "@app/modeles/database/project"
import { ERoles } from "@app/modeles/database/roles"



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
    console.log("by chapters", JSON.stringify(chapters))
    return chapters

}