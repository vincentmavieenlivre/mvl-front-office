import { useState } from "react";

type Props = {}

export default function useCrop(projectId: string | undefined) {

    const [image, setImage] = useState(null)

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    return (
        <div>
            <input type="file" onChange={onImageChange} className="filetype" />
            {image &&
                <img alt="preview image" src={image} />
            }
        </div>
    )


}