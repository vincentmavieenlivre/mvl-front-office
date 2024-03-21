import { useEffect, useState } from "react";

export function useMicrophone() {
    const [isGranted, setIsGranted] = useState(false);


    const ask = async () => {
        if ("MediaRecorder" in window) {
            try {
                const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setIsGranted(true);

            } catch (err: any) {
                console.error("err")
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    }

    useEffect(() => {
        navigator.permissions.query({ name: 'microphone' })
            .then(permissionStatus => {
                console.log("permissions status", permissionStatus)
                if (permissionStatus.state === 'granted') {

                    setIsGranted(true)
                } else if (permissionStatus.state === 'prompt') {
                    ask()
                }
            })
            .catch(error => {
                console.error('Error while checking microphone permission:', error);
            });

        return () => {

        };

    }, []);

    return isGranted;
}