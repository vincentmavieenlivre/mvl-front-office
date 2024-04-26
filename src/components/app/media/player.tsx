import React, { useState, useEffect } from "react";
import { MdOutlinePauseCircle, MdOutlinePlayCircle } from "react-icons/md";

export const playerIconSize = 30

const useAudio = (url: string): [boolean, () => void] => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};



const Player = ({ url }: { url: string }) => {
    const [playing, toggle] = useAudio(url);

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