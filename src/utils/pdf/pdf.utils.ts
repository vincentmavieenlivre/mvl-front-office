import { functions } from "@app/init/firebase";
import { IdTokenResult } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { getBackendUrl } from "../diverse.utils";


export const openInTab = (url) => {
    const newTab = window.open();
    newTab.location.href = url;
}

export const getPdf = async (tokenResult: IdTokenResult, projectId: string,) => {
    const response = await fetch(getBackendUrl() + '/getPdf', {
        method: 'POST',
        body: JSON.stringify({ projectId: projectId, tokenResult: tokenResult }), // Replace with your data object
        headers: {
            'Content-Type': 'application/json',
        },
    });


    const blob = await response.blob();
    // Create a URL for the PDF blob
    const url = URL.createObjectURL(blob);


    // Create a link element to download the PDF
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mon-enfance.pdf';

    // Append the link to the document body and click it to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the URL and link element after the download
    URL.revokeObjectURL(url);

}

export const getPdfImages = async (tokenResult: IdTokenResult, projectId: string,) => {
    const response = await fetch(getBackendUrl() + '/getImages', {
        method: 'POST',
        body: JSON.stringify({ projectId: projectId, tokenResult: tokenResult }), // Replace with your data object
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return (await response.json()).images

    const blob = await response.blob();
    // Create a URL for the PDF blob
    const url = URL.createObjectURL(blob);
    return url
    /* 
        // Create a link element to download the PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mon-enfance.pdf';
    
        // Append the link to the document body and click it to trigger the download
        document.body.appendChild(link);
        link.click();
    
        // Clean up the URL and link element after the download
        URL.revokeObjectURL(url); */

}

export const loadPdf = async () => {
    if (functions) {
        console.log("pdf")
        const test = httpsCallable(functions, 'renderPdfTest');
        const response = await test({ audioUrl: "test" })
        const pdfData = response.data; // Retrieve the PDF data from the response

        console.log("pdfdata", pdfData)

        // Create a blob from the PDF data
        const blob = new Blob([pdfData], { type: 'application/pdf' });

        // Create a URL for the PDF blob
        const url = URL.createObjectURL(blob);

        // Create a link element to download the PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated.pdf';

        // Append the link to the document body and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the URL and link element after the download
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }

}