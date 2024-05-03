import { ISaveDialog, selectSaveDialog, setShouldSave, setDisplaySaveDialog } from '@app/redux/current.project.slice'
import { RootState } from '@app/redux/store'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type Props = {
    onSave: () => Promise<any>

}

export default function SaveDialog(props: Props) {
    let navigate = useNavigate()
    let dispatch = useDispatch()

    const [isSaving, setIsSaving] = useState(false)


    let displaySaveDialog: ISaveDialog = useSelector((state: RootState) => {
        return selectSaveDialog(state)
    })


    let nextRoute: string | undefined = displaySaveDialog.wantedRoute

    const doNavigation = () => {
        dispatch(setShouldSave(false))
        dispatch(setDisplaySaveDialog({
            wantedRoute: undefined,
            displaySaveDialog: false
        }))

        if (nextRoute) navigate(nextRoute)
    }


    return (
        <>
            <input type="checkbox" checked={displaySaveDialog.displaySaveDialog ?? false} onChange={() => { }} id="save_dialog" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Voulez vous sauvegarder votre question ?</h3>

                    <div className="modal-action">


                        <label onClick={() => { /* do not save and navigate */
                            doNavigation()
                        }} htmlFor="save_dialog" className="btn border-sky-400 text-sky-400">Non</label>


                        <button onClick={async () => { /* save and navigate */
                            setIsSaving(true)
                            await props.onSave()
                            setTimeout(() => {
                                setIsSaving(false)
                            }, 200);
                            doNavigation()
                        }} className='btn btn-primary text-sky-50 '>
                            {isSaving == false &&
                                <span>Sauvegarder</span>
                            }

                            {isSaving == true &&
                                <span className="loading loading-spinner"></span>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    )


}