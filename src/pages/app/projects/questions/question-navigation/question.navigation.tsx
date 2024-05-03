import { LeftCircleOutlined, RightCircleOutlined, RightOutlined } from '@ant-design/icons';
import ButtonChapter from '@app/components/app/ui/buttons/button-chapter';
import { selectShouldSave, setDisplaySaveDialog } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sticky from 'react-sticky-el';
type Props = {
    currentIndex: number;
    lastIndex: number;
    chapterStr: string;
    prevId: string | undefined;
    nextId: string | undefined;
    projectId: string;
}

const navBtnIconSize = 25;

export default function QuestionNavigation(props: Props) {

    let dispatch = useDispatch()

    let shouldSave: boolean = useSelector((state: RootState) => {
        return selectShouldSave(state)
    })


    const preventNavigation = (e, wantedRoute: string) => {
        if (shouldSave) {
            e.preventDefault()
            dispatch(setDisplaySaveDialog({
                wantedRoute: wantedRoute,
                displaySaveDialog: true
            }))
        }
    }

    let prev = `/app/projects/${props.projectId}/questions/${props.prevId}`
    let next = `/app/projects/${props.projectId}/questions/${props.nextId}`

    return (
        <div className='mt-4 gap-3 flex flex-col ml-5 mr-5 items-center'>
            <div className='text-gray-500 uppercase text-sm'>nombre de réponses {props.currentIndex}/{props.lastIndex}</div>
            <progress className="progress progress-primary w-100 bg-sky-100 progress-anchor" value="10" max="100"></progress>
            <ButtonChapter className='chapter-anchor'>{props.chapterStr}</ButtonChapter>
            <Sticky dontUpdateHolderHeightWhenSticky={true} stickyStyle={{ justifyContent: "space-around", alignItems: "center" }}>
                <div style={{ width: "100%" }}>
                    <div className="w-full !important flex flex-row justify-around mt-4 mb-4 items-center">

                        {props.prevId &&
                            <button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                                <Link onClick={(e) => preventNavigation(e, prev)} to={prev}>
                                    <LeftCircleOutlined className='text-sky-300 ' style={{ fontSize: navBtnIconSize }} />
                                </Link>

                            </button>
                        }

                        <label htmlFor="my-drawer" className="btn border-transparent bg-sky-50 b-sky-900 text-sky-600 uppercase shadow-sky-200">Sommaire</label>


                        {
                            props.nextId &&
                            <Link onClick={(e) => preventNavigation(e, next)} to={next}>

                                < button className='btn bg-sky-50 text-sky-100 b-sky-900 shadow-sky-200'>
                                    <RightCircleOutlined className='text-sky-300' style={{ fontSize: navBtnIconSize }} />
                                </button>
                            </Link>
                        }
                    </div></div>


            </Sticky>
        </div >
    )
}