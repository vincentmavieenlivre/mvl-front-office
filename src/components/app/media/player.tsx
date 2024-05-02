import React, { useState, useEffect } from "react";
import { MdOutlinePauseCircle, MdOutlinePlayCircle } from "react-icons/md";

export const playerIconSize = 30

const useAudio = (url: string): [boolean, () => void, () => void] => {
    const [audio] = useState(new Audio());
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    const stop = () => {
        audio.pause()
    }

    useEffect(() => {
        if (playing) {
            audio.src = url
            audio.play()
        } else {

            audio.pause();
        }
    },
        [playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle, stop];
};



const Player = ({ url }: { url: string }) => {
    const [playing, toggle, stop] = useAudio(url);

    useEffect(() => {


        return () => {
            console.log("delete")
            stop()
        }
    }, [])


    return (
        <div>
            {playing == false &&
                <MdOutlinePlayCircle className="text-sky-700" size={playerIconSize} onClick={() => toggle()} />}
            {playing == true &&

                < MdOutlinePauseCircle className="text-sky-700" size={playerIconSize} onClick={() => toggle()} />
            }
        </div>
    );
};

export default Player;