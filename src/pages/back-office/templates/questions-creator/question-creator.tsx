import { IBookQuestion, IBookQuestionEditable } from '@app/modeles/database/book/book-question'
import { Button, Input, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons';


type Props = {
    questions: IBookQuestion[]
    onListChange: (questions: IBookQuestionEditable[]) => void
    onToDelete: (toDeleteIds: string[]) => void
}

export default function QuestionCreator(props: Props) {
    const [inputValue, setInputValue] = useState('');




    const [questions, setQuestions] = useState<IBookQuestionEditable[]>([])
    const [questionsToDelete, setQuestionsToDelete] = useState<string[]>([])

    useEffect(() => {
        if (questions.length == 0) {
        } else {
            props.onListChange(questions)
        }
    }, [questions])

    useEffect(() => {
        if (questions.length == 0) {
            let editableQuestions: IBookQuestionEditable[] = props.questions.map((q: IBookQuestion) => {
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
        setInputValue(e.target.value);
    };

    const onExistingQuestionChange = (e: any, index: number) => {
        let titleValue = e.target.value
        console.log("modif de ", titleValue)
        const updatedQuestions = [...questions];
        let q = updatedQuestions[index]

        q.questionTitle = titleValue
        if (q.id) {
            q.changed = true
        }
        setQuestions(updatedQuestions)

    };


    const handleAddQuestion = () => {
        let q: IBookQuestionEditable = {
            questionTitle: inputValue,
            new: true
        }
        let qs = [...questions, q]
        console.log("questions", qs)
        setQuestions(qs)
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
        let q = updatedQuestions[index]

        if (q.id) { // if ever at db side
            questionsToDelete.push(q.id)
            let idsToDelete = [...questionsToDelete, q.id]
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



    return (
        <>

            <div>
                <Input onKeyDown={handleKeyDown} value={inputValue} onChange={onNewQuestionChange} />
                <Button className='mt-4 mb-10' type="primary" onClick={handleAddQuestion}>
                    Ajouter une question
                </Button>
            </div>
            <List
                size="large"
                header={<div>Liste des questions associées</div>}
                bordered
                dataSource={questions}
                renderItem={(item: IBookQuestion, index) => {



                    return (
                        <List.Item>
                            <Input value={item.questionTitle} onChange={(e) => onExistingQuestionChange(e, index)} />


                            <div className="flex-shrink-0 ">
                                <Button
                                    type="text"
                                    icon={<ArrowUpOutlined />}
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                />
                                <Button
                                    type="text"
                                    className='ant-btn-icon'
                                    icon={<ArrowDownOutlined />}
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === questions.length - 1}
                                />
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(index)}
                                />
                            </div>
                        </List.Item>
                    )
                }}
            />


        </>
    )
}