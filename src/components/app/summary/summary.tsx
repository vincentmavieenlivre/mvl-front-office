import { RightCircleOutlined } from '@ant-design/icons';
import useProject from '@app/hook/use-project';
import { IBookQuestion } from '@app/modeles/database/book/book-question';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { selectProject, selectChapters, selectShouldSave, setDisplaySaveDialog } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import { pluralize } from '@app/utils/diverse.utils';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SaveDialog from '../studio/save-dialog/save-dialog';
import ImageCropDialog from '../images/image-crop-dialog';
import { ImageUploader } from '../images/image-uploader';
import { MdAddPhotoAlternate } from 'react-icons/md';

type Props = {
    saveDialog?: boolean;
    projectId?: string
}

export default function Summary(props: Props) {


    let shouldSave: boolean = useSelector((state: RootState) => {
        return selectShouldSave(state)
    })

    const [selectedImage, setSelectedImage] = useState(undefined)


    useProject(props.projectId)

    let nav = useNavigate()
    let dispatch = useDispatch()

    let project: Project | undefined = useSelector((state: RootState) => {
        return selectProject(state)
    })


    let chapters: IChapterTree[] | undefined = useSelector((state: RootState) => {
        return selectChapters(state)
    })

    const renderQuestion = (q: IBookQuestion, index) => {

        const hasAnswers = (q.responses && q.responses?.length > 0) ?? false;
        const numAnswers = q.responses?.length || 0

        const wantedRoute = `/app/projects/${project.id}/questions/${q.id}`

        return (
            <label id={q.id} key={q.id}
                onClick={(e) => {
                    console.log('nav', e.cancelable)
                    if (e.defaultPrevented == false) {
                        if (props.saveDialog && shouldSave) {
                            dispatch(setDisplaySaveDialog({
                                wantedRoute: wantedRoute,
                                displaySaveDialog: true
                            }))
                        } else {
                            nav(wantedRoute)
                        }
                    }
                }}
                className={`mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-col ${hasAnswers ? "border-green-400 border-2" : ''}`}
                htmlFor="my-drawer">
                {/* <Link to={`/app/projects/${project.id}/questions/${q.id}`} key={q.id} className='mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-row items-center'> */}
                <div className='flex flex-row items-center justify-around'>
                    <div className='text-sm'>{q.questionTitle}</div>
                    <RightCircleOutlined className='text-sky-600 px-4' />
                </div>
                {hasAnswers &&
                    <div className='mt-2 self-end text-green-400'><b>{numAnswers}</b> {pluralize('réponse', numAnswers)} {pluralize('sauvegardée', numAnswers)} </div>
                }

                {hasAnswers &&
                    <button onClick={(e) => {
                        console.log('rimage')
                        e.preventDefault()
                    }} className='m-4 btn  bg-sky-50 text-sky-400 b-sky-900 shadow-sky-200 text-xs btn-sm'>
                        <MdAddPhotoAlternate size={25} /> Ajouter une photo
                    </button>
                }
            </label>
        )
    }

    const renderChapters = () => {
        return (

            <div className='mt-4'>
                {chapters?.map((c: IChapterTree, index: number) => {
                    return (
                        <div key={c.id} className="collapse collapse-arrow bg-sky-100 mt-4">
                            <input type="checkbox" name={"test"} defaultChecked={index == 0} />
                            <div className='collapse-title flex flex-row items-center'>

                                <div className=" text-xl font-medium">

                                    <span className=''>{c.name}</span>
                                </div>
                            </div>
                            <div className="collapse-content">
                                <ImageUploader onImageSelected={(imageUrl) => {
                                    setSelectedImage(imageUrl)
                                    console.log("open modal")
                                    document.getElementById('crop_modal').showModal()
                                }}>
                                    <button className='btn bg-sky-50 text-sky-400 text-xs b-sky-900 shadow-sky-200 btn-sm'>
                                        <MdAddPhotoAlternate size={25} /> Ajouter une photo
                                    </button>

                                </ImageUploader>

                                {c.orderedQuestions?.map((q: IBookQuestion, index) => renderQuestion(q, index))}
                            </div>
                        </div>

                    )
                })
                }


                <ImageCropDialog aspectRatio={1 / 1.41} selectedImage={selectedImage}></ImageCropDialog>









            </div >
        )
    }

    return renderChapters()

}