import { CustomerServiceOutlined, DownloadOutlined, ReadOutlined } from '@ant-design/icons'
import AudioRecorder from '@app/components/app/media/AudioRecorder'
import { UserProjectsService } from '@app/domains/services/user-projects.service'
import { useMicrophone } from '@app/hook/use-microphone'
import { db, functions } from '@app/init/firebase'
import { IBookQuestion } from '@app/modeles/database/book/book-question'
import { Project } from '@app/modeles/database/project'
import { ECollections } from '@app/utils/firebase/firestore-collections'
import { FirestoreHelper } from '@app/utils/firebase/firestore-helper'
import { loadPdf, nestPdf, openInTab } from '@app/utils/pdf/pdf.utils'
import { Badge, Button, Divider, FloatButton, List } from 'antd'
import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { Document, Page, Thumbnail } from 'react-pdf';

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

    const [project, setProject] = useState<Project>()
    const [questions, setQuestions] = useState<IBookQuestion[]>([])
    const micGranted: boolean = useMicrophone()

    const [bookPdfUrl, setBookPdfUrl] = useState<string | undefined>(undefined)
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }


    const loadProject = async () => {
        const pm = new UserProjectsService(params.id)
        const p = await pm.loadProject()
        if (p) {
            const questions: IBookQuestion[] = await pm.loadQuestions()
            if (questions.length > 0) {
                setQuestions(questions)
            }
            console.log("question length", questions)
            setProject(p)
        }
    }

    const onInvite = async () => {
        const email = "family@test.com"
        if (functions) {
            const test = httpsCallable(functions, 'inviteFamily');
            const result = await test({ familyEmail: email })
            console.log("[invite family result]", result)
        }
    }

    useEffect(() => {
        console.log("grand change", micGranted)
    }, [micGranted])



    useEffect(() => {
        loadProject()

    }, [])



    return (
        <div style={{ marginBottom: 150 }}>
            <div className="flex justify-between items-center">
                {project &&
                    <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                }
                <button onClick={onInvite} className="btn btn-primary">Inviter un proche</button>
            </div>



            <List className='mt-10'
                itemLayout="horizontal"
                dataSource={questions}
                renderItem={(item, index) => (
                    <div className='mt-10'>
                        <div className='flex flex-row'>
                            <Badge count={index + 1} showZero color='#5965fe' />
                            <h3 className="text-1xl font-bold text-gray-800 ml-2">{item.questionTitle}</h3>

                        </div>
                        {micGranted == true &&
                            <AudioRecorder mockedText={mockData[index]} projectId={params.id} question={item}></AudioRecorder>
                        }
                        {/* <List.Item.Meta
                            title={<h3 className="text-1xl font-bold text-gray-800">{item.questionTitle}</h3>}

                        />
                        <List.Item.Meta>
                            <div>

                                {micGranted == true &&
                                    <AudioRecorder projectId={params.id} question={item}></AudioRecorder>
                                }


                            </div>
                        </List.Item.Meta> */}
                    </div>
                )}
            />

            <button onClick={async () => {
                const url = await nestPdf()
                console.log("final url book", url)
                setBookPdfUrl(url)
            }}
                style={{ zIndex: 9999, position: "fixed", bottom: 40, right: 40 }} className="btn btn-primary">
                <ReadOutlined style={{ fontSize: 25 }} size={500} /> Générer votre livre </button>


            {bookPdfUrl &&
                <div className='flex flex-row justify-center mt-20'>
                    <div className='document' >

                        <Document  className={"p-4 document"} renderMode="canvas" file={bookPdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                            <Thumbnail  width={500}  pageNumber={pageNumber} />
                            
                            <div className="flex flex-row justify-around mt-6">
                            
                            <button onClick={() => setPageNumber(pageNumber - 1 >= 1 ? pageNumber - 1 : 1 )} className="btn btn-circle btn-outline">
                                {'<'}
                            </button>

                            <button onClick={() =>  openInTab(bookPdfUrl) } className="btn btn-outline">
                                {'Télécharger'}
                            </button>


                            <button onClick={() => setPageNumber( pageNumber  < (numPages as number) ? pageNumber + 1 : numPages as number) } className="btn btn-circle btn-outline">
                                {'>'}
                            </button>
                            </div>

                        </Document>
                    </div>
                </div>
            }
        </div>
    )
}