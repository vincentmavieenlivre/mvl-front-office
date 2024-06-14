import { ReadOutlined } from '@ant-design/icons'
import { functions } from '@app/init/firebase'
import { openInTab } from '@app/utils/pdf/pdf.utils'
import { httpsCallable } from 'firebase/functions'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FcPrevious } from 'react-icons/fc'
import SummaryWithStates from '@app/components/app/summary/summary-with-states'
import useProject from '@app/hook/use-project'
import { IdTokenResult } from 'firebase/auth'
import { selectToken } from '@app/redux/auth.slice'
import HTMLFlipBook from "react-pageflip"
import Summary from '@app/components/app/summary/summary'

type Props = {}

export default function ShowProjectPage({ }: Props) {
    const params: any = useParams()

    useProject(params.id)

    const tokenResult: IdTokenResult | undefined = useSelector(selectToken)


    const [bookPdfUrl, setBookPdfUrl] = useState<string | undefined>(undefined)
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [bookPagesImages, setBookPagesImages] = useState<string[]>([])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }





    return (
        <div className='m-5'>

            <Link className='flex gap-4 flex-row items-center text-sky-900' to={'/app'}>
                <FcPrevious size={'1.5em'} className='text-sky-900'></FcPrevious>
                <span className='text-sky-900'>Mes livres</span>
            </Link>

            <h2 className=' mt-12 text-sky-950  text-xl font-bold'>De quoi aimeriez-vous parler pour commencer ?</h2>

            <div className='text-sky-950 mt-4'>
                <p>Voiçi le sommaire de votre livre</p>
                <p className='mt-4'>Composez le en choisissant librement vos thèmes préférés</p>
            </div>



            {bookPagesImages?.length > 0 &&
                <HTMLFlipBook width={414} height={414 * 1.41}>
                    {bookPagesImages.map((img) =>
                        <img src={`data:image/png;base64,${img}`} />
                    )

                    }
                </HTMLFlipBook>
            }


            <Summary projectId={params.id}></Summary>

        </div>
    )
}