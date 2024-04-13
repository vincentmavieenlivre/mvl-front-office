import { LeftCircleOutlined, RightCircleOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react'
import { Link } from 'react-router-dom';

type Props = {
    currentIndex: number;
    lastIndex: number;
    chapterStr: number;
    prevId: string | undefined;
    nextId: string | undefined;
    projectId: string;
}

const navBtnIconSize = 25;

export default function QuestionNavigation(props: Props) {



    return (
        <div className='mt-4 gap-3 flex flex-col ml-5 mr-5 items-center'>
            <div className='text-gray-500 uppercase text-sm'>nombre de réponses {props.currentIndex}/{props.lastIndex}</div>
            <progress className="progress progress-primary w-80 bg-sky-100" value="10" max="100"></progress>
            <button className='btn btn-block bg-sky-300 text-sky-50 text-1xl w-80 rounded-3xl'>{props.chapterStr}</button>

            <div className="w-full !important flex flex-row justify-between mt-4 items-center">

                {props.prevId &&
                    <button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                        <Link to={`/app/projects/${props.projectId}/questions/${props.prevId}`}>
                            <LeftCircleOutlined className='text-sky-300 ' style={{ fontSize: navBtnIconSize }} />
                        </Link>

                    </button>
                }

                <Link to={`/app/projects/${props.projectId}`}>

                    <button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                        <div className='uppercase text-sky-600'>sommaire</div>
                    </button>
                </Link>
                {
                    props.nextId &&
                    <Link to={`/app/projects/${props.projectId}/questions/${props.nextId}`}>

                        < button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                            <RightCircleOutlined className='text-sky-300' style={{ fontSize: navBtnIconSize }} />
                        </button>
                    </Link>
                }

            </div>

        </div >
    )
}