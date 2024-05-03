import { LeftCircleOutlined, RightCircleOutlined, RightOutlined } from '@ant-design/icons';
import ButtonChapter from '@app/components/app/ui/buttons/button-chapter';
import { IBookQuestion } from '@app/modeles/database/book/book-question';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Sticky from 'react-sticky-el';
type Props = {
    currentIndex: number;
    lastIndex: number;
    chapterStr: string;
    prevId: string | undefined;
    nextId: string | undefined;
    projectId: string;
    question: IBookQuestion;
    onHeaderFixed: (fixed: boolean) => void;
}

const navBtnIconSize = 25;

export default function QuestionNavigation(props: Props) {

    const [isFixed, setIsFixed] = useState(false)

    useEffect(() => {
        props.onHeaderFixed(isFixed)
    }, [isFixed])


    return (
        <div className='mt-4 gap-3 flex flex-col ml-5 mr-5 items-center'>
            <div className='text-gray-500 uppercase text-sm'>nombre de réponses {props.currentIndex}/{props.lastIndex}</div>
            <progress className="progress progress-primary w-100 bg-sky-100 progress-anchor" value="10" max="100"></progress>
            <ButtonChapter className='chapter-anchor'>{props.chapterStr}</ButtonChapter>


            <Sticky

                onFixedToggle={setIsFixed}

                dontUpdateHolderHeightWhenSticky={true} stickyStyle={{ justifyContent: "space-around", alignItems: "center" }}>



                <div className='flex flex-col'>



                    <div style={{ width: "100%" }}>
                        <div className="w-full !important flex flex-row justify-around mt-4 mb-4 items-center">

                            {props.prevId &&
                                <button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                                    <Link to={`/app/projects/${props.projectId}/questions/${props.prevId}`}>
                                        <LeftCircleOutlined className='text-sky-300 ' style={{ fontSize: navBtnIconSize }} />
                                    </Link>

                                </button>
                            }

                            <label htmlFor="my-drawer" className="btn border-transparent bg-sky-50 b-sky-900 text-sky-600 uppercase shadow-sky-200">Sommaire</label>


                            {
                                props.nextId &&
                                <Link to={`/app/projects/${props.projectId}/questions/${props.nextId}`}>

                                    < button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                                        <RightCircleOutlined className='text-sky-300' style={{ fontSize: navBtnIconSize }} />
                                    </button>
                                </Link>
                            }
                        </div>
                    </div>



                    <div style={{ height: isFixed ? '20px' : '0px' }} className={`pl-4 pr-4 mb-1 text-sky-950 text-md font-bold opacity-0 ${isFixed == true ? ' opacity-100 transition-opacity duration-1000 ' : ''} `}>
                        {props.question.questionTitle}
                    </div>


                </div>
            </Sticky>
        </div >
    )
}