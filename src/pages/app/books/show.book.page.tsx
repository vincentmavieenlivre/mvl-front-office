import { ReadOutlined } from '@ant-design/icons'
import { nestPdf } from '@app/utils/pdf/pdf.utils'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FcPrevious } from 'react-icons/fc'
import Summary from '@app/components/app/summary/summary'
import HTMLFlipBook from "react-pageflip"
import { IdTokenResult } from 'firebase/auth'
import { selectToken } from '@app/redux/auth.slice'
import { useSelector } from 'react-redux'
import Lottie from 'react-lottie';
import writingBookAnimationData from '../../../assets/animations/writing-book.json'

type Props = {}

export default function ShowBookPage({ }: Props) {
    const params: any = useParams()

    /* redux */
    const tokenResult: IdTokenResult | undefined = useSelector(selectToken)

    /* states */
    const [bookPagesImages, setBookPagesImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const loadImages = async () => {
        setLoading(true)
        const images = await nestPdf(tokenResult, params.id).finally(() => setLoading(false))
        console.log("images", images.length)
        setBookPagesImages(images)
    }

    useEffect(() => {
        loadImages()
    }, [])

    const recordAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: writingBookAnimationData,
        /*   rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
          } */
    };



    return (
        <div>

            <Link className='m-5 flex gap-4 flex-row items-center text-sky-900' to={`/app/projects/${params.id}`}>
                <FcPrevious size={'1.5em'} className='text-sky-900'></FcPrevious>
                <span className='text-sky-900'>Retour</span>
            </Link>

            {loading &&
                <div className=' m-4 mt-12'>
                    <h2 className='  text-sky-950  text-xl font-bold'>Nous générons un aperçu de votre livre</h2>
                    <p className='mt-4'>Capturez et préservez les précieux souvenirs de vos résidents en créant des livres de vie personnalisés.</p>

                    <Lottie isClickToPauseDisabled={true} options={recordAnimationOptions}
                        width={"100%"}
                        style={{ zIndex: 9000 }}
                    />
                </div>
            }
            {bookPagesImages?.length > 0 &&
                <HTMLFlipBook width={414} height={414 * 1.41}>
                    {bookPagesImages.map((img) =>
                        <img src={`data:image/png;base64,${img}`} />
                    )

                    }
                </HTMLFlipBook>
            }

        </div>
    )
}