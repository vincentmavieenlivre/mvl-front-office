import { PlusOutlined } from '@ant-design/icons';
import { storage } from '@app/init/firebase';
import { IBookTemplate } from '@app/modeles/database/book/book-template';
import { Card, GetProp, Modal, Upload, UploadFile, UploadProps, message } from 'antd';
import Meta from 'antd/es/card/Meta';
import { UploadChangeParam } from 'antd/es/upload';
import { StorageReference, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


type Props = {
    template?: IBookTemplate;
    onCoverUploaded: (coverUrl: string) => void
}

export default function TemplateThemeCreator(props: Props) {
    let coverRef: StorageReference

    const [coverImgUrl, setCoverImgUrl] = useState<string | undefined>(undefined)

    useEffect(() => {

        if (storage && props.template?.id) {
            coverRef = ref(storage, `themes/${props.template.id}/cover.jpg`);

        }

    }, [])


    const [fileList, setFileList] = useState<UploadFile[]>([

    ]);


    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Couverture</div>
        </button>
    );


    const customUpload = async ({ onError, onSuccess, file }) => {
        if (!storage) return
        const metadata = {
            contentType: 'image/jpeg'
        }
        coverRef = ref(storage, `themes/${props.template?.id}/cover.jpg`);
        console.log("custome upload", file)
        const imageName = file.uid; //a unique name for the image

        try {
            console.log("custom upload go for", file)
            let resSnapshot = await uploadBytes(coverRef, file)
            console.log('Uploaded a blob or file!', resSnapshot);

            let downloadURL = await getDownloadURL(resSnapshot.ref)
            console.log('File available at', downloadURL);
            setCoverImgUrl(downloadURL)
            onSuccess(null, file);
            props.onCoverUploaded(downloadURL)
        } catch (e) {
            onError(e);
        }
    };




    return (
        <>

            <div className='flex flex-row justify-start'>
                {props.template?.coverUrl &&
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={props.template?.coverUrl} />}
                    >
                        <Meta title="Image de couverture" />
                    </Card>
                }
                <div className='ml-4 w-1/5'>
                    <Upload
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
                        fileList={[]}
                        customRequest={customUpload}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </div>

            </div>
        </>
    );

}