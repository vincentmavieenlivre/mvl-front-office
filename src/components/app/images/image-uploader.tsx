import React, { useRef } from "react";
import { useState } from "react";
import 'react-image-crop/dist/ReactCrop.css'
export function ImageUploader(props: any) {
    const fileInputRef = useRef(null);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const url = reader.result;
            //setImageURL(url);
            props.onImageSelected(url)
            fileInputRef.current.value = "";
        };

        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        // Call the onClick callback from the parent component
        fileInputRef.current.click();
    };

    return (
        <div>
            {React.cloneElement(props.children, {
                onClick: handleButtonClick
            })}
            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />

        </div>
    );
}
