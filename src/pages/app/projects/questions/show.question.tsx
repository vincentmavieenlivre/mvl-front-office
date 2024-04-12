import { selectQuestion, selectQuestionPosition } from '@app/redux/current.project.slice'
import { RootState } from '@app/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionNavigation from './question-navigation/question.navigation'
import "./record-container.scss"
type Props = {}

export default function ShowQuestion({ }: Props) {

    const navigate = useNavigate()
    const params: any = useParams()

    let { id: projectId, questionId } = params;
    console.log("test, id: ", projectId, "questions", questionId)


    let [question, chapter] = useSelector((state: RootState) => { return selectQuestion(state, questionId) })

    let [index, totalCount] = useSelector((state: RootState) => {
        return selectQuestionPosition(state, chapter.id, questionId)
    })

    console.log("question", question.id, "chapter", chapter.id, `${index}/${totalCount}`)

    return (
        <React.Fragment>
            <QuestionNavigation currentIndex={index} lastIndex={totalCount} chapterStr={chapter.name}></QuestionNavigation>

            <div className='m-5 mt-7 text-sky-950'>
                {question.questionTitle}

            </div>

            <div className='record-container'>
                <svg stroke='#b1e6fd' color='green' fill="#b1e6fd" viewBox="0 0 202.9 45.5" >

                    <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7
          c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5
          c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>

                </svg>

            </div>

            <button className="
            left-1/2 transform -translate-x-1/2 -translate-y-1/2 bottom-[0.5em]
            w-[7em] h-[7em] rounded-full bg-sky-500 text-white flex items-center justify-center absolute  z-50  ">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 9C4.41421 9 4.75 9.33579 4.75 9.75V10.75C4.75 14.7541 7.99594 18 12 18C16.0041 18 19.25 14.7541 19.25 10.75V9.75C19.25 9.33579 19.5858 9 20 9C20.4142 9 20.75 9.33579 20.75 9.75V10.75C20.75 15.3298 17.2314 19.0879 12.75 19.4683V21.75C12.75 22.1642 12.4142 22.5 12 22.5C11.5858 22.5 11.25 22.1642 11.25 21.75V19.4683C6.7686 19.0879 3.25 15.3298 3.25 10.75V9.75C3.25 9.33579 3.58579 9 4 9Z" fill="#1C274C" />
                    <path opacity="0.5" d="M12 2C8.82436 2 6.25 4.57436 6.25 7.75V10.75C6.25 13.9256 8.82436 16.5 12 16.5C14.9214 16.5 17.334 14.3213 17.7015 11.5L13 11.5C12.5858 11.5 12.25 11.1642 12.25 10.75C12.25 10.3358 12.5858 10 13 10L17.75 10V8.5H13C12.5858 8.5 12.25 8.16421 12.25 7.75C12.25 7.33579 12.5858 7 13 7H17.7015C17.334 4.17873 14.9214 2 12 2Z" fill="#1C274C" />
                    <path d="M12.25 10.75C12.25 11.1642 12.5858 11.5 13 11.5L17.7015 11.5L17.75 10L13 10C12.5858 10 12.25 10.3358 12.25 10.75Z" fill="#1C274C" />
                    <path d="M12.25 7.75C12.25 8.16421 12.5858 8.5 13 8.5H17.75L17.7015 7H13C12.5858 7 12.25 7.33579 12.25 7.75Z" fill="#1C274C" />
                </svg>
            </button>

            <div className="record-bar bg-sky-200"></div>

        </React.Fragment>
    )
}