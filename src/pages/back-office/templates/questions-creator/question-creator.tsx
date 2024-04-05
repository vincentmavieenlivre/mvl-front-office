import { IBookQuestion, IBookQuestionEditable } from '@app/modeles/database/book/book-question'
import { Button, Input, List, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons';
import { Title } from '@refinedev/antd';
import _ from 'lodash';
import { IChapter } from '@app/modeles/database/book/book-template';
import { db } from '@app/init/firebase';
import { nanoid } from 'nanoid'

type Props = {
    questions: IBookQuestion[]
    chapters: IChapter[]
    onListChange: (questions: IBookQuestionEditable[]) => void
    onToDelete: (toDeleteIds: string[]) => void
    onChapterAdded:(t:IChapter) => void
}

export default function QuestionCreator(props: Props) {
    const [questionInputValue, setQuestionInputValue] = useState('');
    const [themeInputValue, setThemeInputValue] = useState('');





    const [questions, setQuestions] = useState<IBookQuestionEditable[]>([])
    const [questionsToDelete, setQuestionsToDelete] = useState<string[]>([])
    const [questionsByChapter, setQuestionsByChapter] = useState<{}>([])

    useEffect(() => {
        if (questions.length == 0) {
        } else {
            props.onListChange(questions)
        }

        const grouped = _.groupBy(questions, (q: IBookQuestionEditable) => q.chapterId || "no_theme")
        console.log("grouped", grouped)
        setQuestionsByChapter(grouped)



    }, [questions])

    useEffect(() => {
        if (questions.length == 0) {
            const editableQuestions: IBookQuestionEditable[] = props.questions.map((q: IBookQuestion) => {
                return {
                    ...q,
                    new: false,
                    delete: false,
                    changed: false
                }
            })
            setQuestions(editableQuestions)
        }
    }, [props.questions])



    const onNewQuestionChange = (e: any) => {
        console.log("ajout de ", e.target.value)
        setQuestionInputValue(e.target.value);
    };

    const onExistingQuestionChange = (field: keyof IBookQuestionEditable, value: any, index: number) => {
        const updatedQuestions = [...questions];
        const q:any = updatedQuestions[index]
        console.log("modif de ", field, " => ", value)
        q[field] = value
        if (q.id) {
            q.changed = true
        }
        setQuestions(updatedQuestions)

    };


    const handleAddQuestion = () => {
        const q: IBookQuestionEditable = {
            questionTitle: questionInputValue,
            new: true
        }
        const qs = [...questions, q]
        console.log("questions", qs)
        setQuestions(qs)
    };

    const handleAddTheme = () => {
        const q: IChapter = {
            name: themeInputValue,
            id: nanoid()
        }
        props.onChapterAdded(q)
    };


    const handleMoveUp = (index: number) => {
        if (index > 0) {
            const updatedQuestions = [...questions];
            const temp = updatedQuestions[index];
            updatedQuestions[index] = updatedQuestions[index - 1];
            updatedQuestions[index - 1] = temp;
            setQuestions(updatedQuestions);
        }
    };

    const handleMoveDown = (index: number) => {
        if (index < questions.length - 1) {
            const updatedQuestions = [...questions];
            const temp = updatedQuestions[index];
            updatedQuestions[index] = updatedQuestions[index + 1];
            updatedQuestions[index + 1] = temp;
            setQuestions(updatedQuestions);
        }
    };

    const handleDelete = (index: number) => {
        const updatedQuestions = [...questions];
        const q = updatedQuestions[index]

        if (q.id) { // if ever at db side
            questionsToDelete.push(q.id)
            const idsToDelete = [...questionsToDelete, q.id]
            setQuestionsToDelete(idsToDelete)
            props.onToDelete(idsToDelete)
        }

        updatedQuestions.splice(index, 1) // delete in local state
        setQuestions(updatedQuestions);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleAddQuestion();
        }
    };

    const findIndex = (item:any) => props.questions.findIndex((d) => d.questionTitle ==  item.questionTitle ) 

    return (
        <>

            <div className="flex flex-column justify-between">

                <div className='w-1/2'>
                    <Typography.Title level={5} >Questions associées</Typography.Title>
                    <div>
                    <Input onKeyDown={handleKeyDown} value={questionInputValue} onChange={onNewQuestionChange} />
                        <Button className='mt-4 mb-10' type="primary" onClick={handleAddQuestion}>
                            Ajouter une question
                        </Button>
                    </div>
                </div>

                <div className='w-1/2'>
                    <Typography.Title level={5} >Chapitre(s)</Typography.Title>
                    <Input  value={themeInputValue} onChange={ (e) => setThemeInputValue(e.target.value)} />
                        <Button className='mt-4 mb-10' type="primary" onClick={handleAddTheme}>
                            Ajouter un thème 
                        </Button>
                </div>
            </div>

            {Object.keys(questionsByChapter).map((key: string) => {

                const questions = questionsByChapter[key]
                const chapter = props.chapters.find((c:IChapter) => c.id == key)
                const chapterName = chapter?.name ?? "pas de chapitre"
                return (
                    <>
                        <Typography.Title className='mb-4 mt-4' level={5} >{ _.capitalize(chapterName)}</Typography.Title>
                        <List
                            size="large"
                            //header={<div>Liste des questions associées</div>}
                            bordered
                            dataSource={questions}
                            renderItem={(item: IBookQuestion, index) => {



                                return (
                                    <List.Item>
                                        <Input value={item.questionTitle} onChange={(e) => onExistingQuestionChange("questionTitle", e.target.value, findIndex(item) )} />

                                        <Select
                                            onChange={(value:string) => {   onExistingQuestionChange("chapterId", value, findIndex(item))  }}
                                            value={item.chapterId}
                                            style={{ width: 120 }}
                                            //onChange={handleChange}
                                            options={props.chapters.map((i:IChapter) => {return{
                                                label: i.name,
                                                value: i.id
                                            }})}
                                        />
                                        <div className="flex-shrink-0 ">
                                            <Button
                                                type="text"
                                                icon={<ArrowUpOutlined />}
                                                onClick={() => handleMoveUp( findIndex(item)  )}
                                                disabled={index === 0}
                                            />
                                            <Button
                                                type="text"
                                                className='ant-btn-icon'
                                                icon={<ArrowDownOutlined />}
                                                onClick={() => handleMoveDown( findIndex(item) )}
                                                disabled={index === questions.length - 1}
                                            />
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDelete(findIndex(item))}
                                            />
                                        </div>
                                    </List.Item>
                                )
                            }}
                        />
                    </>
                )
            })

            }




        </>
    )
}