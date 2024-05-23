import React, { useEffect, useState } from 'react'
import { MdAddPhotoAlternate } from "react-icons/md";
import { ImageUploader } from '../images/image-uploader';
import { Crop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
type Props = {
    selectedImage: any;
    aspectRatio: number;
}

export default function ImageCropDialog(props: Props) {

    const [imgRenderedDimensions, setImgRenderedDimensions] = useState({
        width: -1,
        height: -1
    })

    let ASPECT_RATIO = props.aspectRatio

    let config: any = {
        unit: 'px', // Can be 'px' or '%'
        x: 1,
        y: 1,
        width: 100 * ASPECT_RATIO,
        height: 100

    }

    const [crop, setCrop] = useState<Crop>(config)

    const onImageLoad = (e: any) => {

        setImgRenderedDimensions({
            width: e.target.width,
            height: e.target.height
        })
        setCrop({
            ...config,
            x: (e.target.width - config.width) / 2,
            y: (e.target.height - config.height) / 2,
            width: 100 * ASPECT_RATIO,
            height: 100

        });
    };

    function resizeAndCropImage(src: string, cropX: number, cropY: number, cropWidth: number, cropHeight: number, callback: (img: string) => void) {
        var image = new Image();


        // Load the image
        image.onload = function () {

            var originWidth = image.naturalWidth
            var originHeight = image.naturalHeight


            var displayWith = imgRenderedDimensions.width
            var displayHeight = imgRenderedDimensions.height


            console.log("origin:", originWidth, "x", originHeight)
            console.log("display", displayWith, displayHeight)
            var canvas = document.createElement('canvas');
            var ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

            if (!ctx) throw 'canvas is null'


            // convert the px from rendered image into the natural image dimension
            let sx = (cropX / displayWith) * originWidth
            let sy = (cropY / displayHeight) * originHeight
            let sw = (cropWidth / displayWith) * originWidth
            let sh = (cropHeight / displayHeight) * originHeight

            // destination canvas
            canvas.width = sw
            canvas.height = sh
            let dx = 0
            let dy = 0
            let dw = sw
            let dh = sh

            /*     console.log("CANVAS natural image size", originWidth, originHeight)
                console.log("CANVAS crop zone (given rendered image)", cropX, cropY, cropWidth, cropHeight)
                console.log("CANVAS source (into natural image)", sx, sy, sw, " x ", sh)
                console.log("CANVAS destination", dx, dy, dw, " x ", dh) */

            ctx.drawImage(image,
                sx,
                sy,
                sw,
                sh,
                dx,
                dy,
                dw,
                dh
            )

            // Convert the canvas image to data URL
            var resizedImage = canvas.toDataURL();

            // Call the callback function with the resized image data URL
            callback(resizedImage);
        };

        image.src = src;
    }


    const doResize = () => {
        var imageSource = props.selectedImage;
        console.log(crop, crop)

        resizeAndCropImage(imageSource, crop.x, crop.y, crop.width, crop.height, function (resizedImage) {
            // The resized image data URL is available in the 'resizedImage' variable
            /* console.log("resized:")
            console.log(resizedImage); */

            // You can use the resized image data URL to display or further process the image
            /* var imgElement = document.createElement('img');
            imgElement.src = resizedImage;
            document.body.appendChild(imgElement); */

            // TODO : save image
        });
    }

    return (

        <dialog id="crop_modal" className="modal">
            <div className="modal-box w-ful ">

                <button
                    onClick={() => { document.getElementById('crop_modal').close() }}
                    className="btn btn-circle absolute right-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className='mt-6  text-sky-950  text-xl font-bold'>Retouchez votre photo</h2>



                <div className='text-sky-950 mt-4 text-lg mb-6'>
                    <p>En sélectionnant la zone adéquate</p>
                </div>

                {props.selectedImage &&
                    <ReactCrop key={props.selectedImage} keepSelection={true} ruleOfThirds={false} aspect={ASPECT_RATIO}

                        crop={crop} onChange={c => {
                            if (imgRenderedDimensions.width > -1) {
                                setCrop(c)
                            }
                        }}>
                        <img onLoad={onImageLoad} src={props.selectedImage} />
                    </ReactCrop>

                }
                <div className="modal-action flex flex-col gap-10 grow-1 mt-20">

                    {/* <button onClick={() => {

                        document.getElementById('crop_modal').close()
                    }}
                        className="btn">Annuler
                    </button>
 */}

                    <button onClick={() => {
                        doResize()

                    }}
                        className="btn btn-primary text-white">Sauvegarder
                    </button>

                </div>
            </div>
        </dialog>
    )
}