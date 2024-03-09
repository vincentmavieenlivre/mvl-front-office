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
import { IBookTemplate } from "@app/modeles/database/book/book-template";

interface RecordType extends AdminUser {
    key: string | undefined;
}


export const TemplateEdit = () => {
    const { resources, resource, action, id } = useResource();

    const [currentTemplate, setCurrentTemplate] = useState<IBookTemplate>(undefined)
    const [questions, setQuestions] = useState<IBookQuestionEditable[]>([])
    const [toDeleteQuestionIds, setToDeleteQuestionIds] = useState<string[]>([])
    const [organization, setOrganization] = useState<any | undefined>(undefined)

    console.log("template edit")

    let templateManager: BookTemplateManager = new BookTemplateManager(db, id)

    const initData = async () => {
        let template: IBookTemplate = await templateManager.loadTemplate()
        template.id = id as string
        console.log("current template", template)
        setCurrentTemplate(template)

        let questions: IBookQuestion[] = await templateManager.loadQuestions()
        console.log("async load questions", questions)
        console.log("async load order", template.questionsOrder)


        if (template?.questionsOrder && template?.questionsOrder.length > 0) {
            let sortedIds = template.questionsOrder?.sort((a, b) => {
                return a.index > b.index
            })

            let sortedQuestions: IBookQuestion[] = []
            if (sortedIds) {
                for (let s of sortedIds) {
                    let q = questions.find((q) => q.id == s.id)
                    if (q) {
                        sortedQuestions.push(q)
                    }
                }

                setQuestions(sortedQuestions)
            }
        } else { // no order present
            setQuestions(questions)
        }
    }

    useEffect(() => {

        console.log("BUILD TEMPLATE MANAGER", templateManager)

        initData()

    }, [])


    const { mutate, isLoading, isUpdating } = useUpdate();

    const onCoverUploaded = (coverUrl: string) => {
        setCurrentTemplate({ ...currentTemplate, coverUrl: coverUrl })
    }

    const updateOrganization = async (updatedOrganization: Organization) => {
        if (id) {
            await mutate({
                resource: "template",
                id: id,
                values: {
                    ...removeUndefinedRecursive(updatedOrganization)
                },
            });
        }
    };







    const { formProps, saveButtonProps, queryResult } = useForm({
        redirect: "list",
    });




    if (saveButtonProps) {



        saveButtonProps.onClick = (async () => {
            /*    console.log("update with questions", questions)
               console.log("to delete ids", toDeleteQuestionIds) */

            console.log("CLICK ON SAVE", questions)

            // 1) create or update
            for (let q of questions) {
                if (q.new == true) {
                    console.log("CREATE QUESTION", q)
                    await templateManager.createQuestionInTemplate(q)
                }

                if (q.changed) {
                    await templateManager.updateQuestionInTemplate(q)
                }
            }

            // 2) delete
            for (let toDeleteId of toDeleteQuestionIds) {
                await templateManager.deleteQuestionInTemplate(toDeleteId)
            }

            // 3) always save order
            await templateManager.upsertTemplate(questions, currentTemplate.coverUrl)



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
                <QuestionCreator onToDelete={setToDeleteQuestionIds} onListChange={setQuestions} questions={questions}></QuestionCreator>
            </Card>

        </Edit>
    );
};