import { ReadOutlined } from '@ant-design/icons'
import { functions } from '@app/init/firebase'
import { openInTab } from '@app/utils/pdf/pdf.utils'
import { httpsCallable } from 'firebase/functions'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FcPrevious } from 'react-icons/fc'
import Summary from '@app/components/app/summary/summary'
import useProject from '@app/hook/use-project'
import { IdTokenResult } from 'firebase/auth'
import { selectToken } from '@app/redux/auth.slice'
import HTMLFlipBook from "react-pageflip"
const mockData = [
    `Eh bien oui, je me souviens bien que j’étais dans un cours
    privé, le cours Bossuet. Ça commençait en... on appelait ça
    la douzième. Je me souviens de Madame Chauvin. Elle m’a
    appris à lire avec ce qu’on appelait le bonhomme carré. Il
    avait la tête d’un bonhomme et ses bras étaient articulés.`,


    `Ah oui, oui, oui, j’avais un bon copain, il s’appelait Guy. Il
    était assez paresseux de nature et je lui faisais souvent ses
    devoirs.
    Ce qui est amusant, c’est que j’étais dans une école de
    filles, évidemment. Mais les garçons étaient acceptés
    jusqu’à un certain âge. Alors forcément nos parents se
    fréquentaient à cette époque.`,



    `Adolescente, je faisais mes études. Mon père était très
    sévère pour les études, donc on travaillait. J’étais très
    sérieuse parce que nous avions droit à des médailles : il y
    avait la médaille du travail, la médaille de la sagesse. Et
    puis la troisième dont je ne me souviens plus très bien.
    J’avais souvent les trois.
    On m’a toujours dit que j’étais très, très sage à l’école, que
    je travaillais très bien, mais que je me rattrapais à la
    maison.
    Tout m’inquiétait à l’époque. Par exemple, on avait deux
    bacs. À l’écrit, ça allait, mais j’étais très timide et je ne
    voulais pas aller à l’oral. On ne m’a pas donné confiance
    en moi, d’ailleurs on a eu tort. Mais enfin, c’est comme ça.
    J’avais dix-sept ans quand la guerre a éclaté. Alors il y a eu
    l’exode. On est partis à la campagne, chez ma grand-mère
    maternelle. Ma grand-mère paternelle habitait dans le
    même immeuble que nous, mais elle était âgée donc elle
    a voulu rester à Paris.`,


    `J’ai eu la chance d’avoir des parents très compréhensifs.
    Lorsque j’ai eu mon bac, ils m’ont permis de prendre une
    année sabbatique. J’ai fait du piano, de la gymnastique,
    tout ce qui me plaisait, quoi !
    Mais je m’ennuyais. Je me suis rendu compte que ce
    n’était pas une vie. Alors ma mère a cherché ce que je
    voulais faire, on a été voir et finalement j’ai fait HEC. À
    l’époque, on n’était pas avec les hommes. On ne faisait
    pas de géométrie, on faisait de l’arithmétique. Il n’y a
    qu’une chose qui m’a gênée, c’est que je ne connaissais
    pas les langues. J’ai eu beaucoup de mal en anglais.`
]

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