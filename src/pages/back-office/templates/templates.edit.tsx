import { useForm, Edit } from "@refinedev/antd";

import { Form, Input, Card } from "antd";
import { useEffect, useState } from "react";
import { db } from "@app/init/firebase";
import { removeUndefinedRecursive } from "@app/utils/firebase/firestore-helper";
import { useResource, useUpdate } from "@refinedev/core";
import { Organization } from "@app/modeles/database/organization";
import { AdminUser } from "@app/modeles/database/embedded/data-owner";
import QuestionCreator from "./questions-creator/question-creator";
import { IBookQuestion, IBookQuestionEditable } from "@app/modeles/database/book/book-question";
import { BookTemplateManager } from "@app/manager/backoffice/book-template.manager";
import TemplateThemeCreator from "./template-theme/template-theme.create";
import { IBookTemplate, IChapter } from "@app/modeles/database/book/book-template";

interface RecordType extends AdminUser {
    key: string | undefined;
}


export const TemplateEdit = () => {
    const { resources, resource, action, id } = useResource();

    const [currentTemplate, setCurrentTemplate] = useState<IBookTemplate>(undefined)
    const [questions, setQuestions] = useState<IBookQuestionEditable[]>([])
    const [toDeleteQuestionIds, setToDeleteQuestionIds] = useState<string[]>([])
    const [organization, setOrganization] = useState<any | undefined>(undefined)
    const [chapters, setChapters] = useState<IChapter[]>([])

    console.log("template edit")

    const templateManager: BookTemplateManager = new BookTemplateManager(db, id)

    const initData = async () => {
        const template: IBookTemplate = await templateManager.loadTemplate()

        console.log("current template", template)
        setCurrentTemplate(template)
        setChapters(template.chapters ?? [])

        const questions: IBookQuestion[] = await templateManager.loadQuestions()
        console.log("async load questions", questions)
        console.log("async load order", template.questionsOrder)

        setQuestions(questions)

    }

    useEffect(() => {

        console.log("BUILD TEMPLATE MANAGER", templateManager)

        initData()

    }, [])


    const { mutate, isLoading, isUpdating } = useUpdate();

    const onCoverUploaded = (coverUrl: string) => {
        setCurrentTemplate({ ...currentTemplate, coverUrl: coverUrl })
    }

    const { formProps, saveButtonProps, queryResult } = useForm({
        redirect: "list",
    });



    if (saveButtonProps) {



        saveButtonProps.onClick = (async () => {

            // 1) create or update
            for (const q of questions) {
                if (q.new == true) {
                    console.log("CREATE QUESTION", q)
                    await templateManager.createQuestionInTemplate(q)
                }

                if (q.changed) {
                    await templateManager.updateQuestionInTemplate(q)
                }
            }

            // 2) delete
            for (const toDeleteId of toDeleteQuestionIds) {
                await templateManager.deleteQuestionInTemplate(toDeleteId)
            }

            // 3) always save order
            await templateManager.upsertTemplate(questions, currentTemplate.coverUrl, chapters)
        })
    }







    return (
        <Edit saveButtonProps={saveButtonProps}>

            <Form {...formProps} layout="vertical">
                <Form.Item label="Nom du template" name="name">
                    <Input />
                </Form.Item>

            </Form>



            <Card>
                {currentTemplate &&
                    <TemplateThemeCreator onCoverUploaded={onCoverUploaded} template={currentTemplate}></TemplateThemeCreator>
                }
            </Card>
            <Card>
                <QuestionCreator
                    onChapterAdded={(n) => { setChapters([...chapters, {...n, index: chapters.length + 1}]); console.log(n) }}
                    onToDelete={setToDeleteQuestionIds} onListChange={setQuestions}
                    chapters={chapters ?? []}
                    questions={questions}

                ></QuestionCreator>
            </Card>

        </Edit>
    );
};