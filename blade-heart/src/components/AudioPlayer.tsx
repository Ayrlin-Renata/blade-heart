import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { createRef } from 'preact';

interface AudioPlayer {
    src: string;
    icon: boolean | Element;
}

export default function AudioPlayer( {src, icon}: AudioPlayer ) {
    const ext = src.split(".").pop();

    const audioRef = createRef();

    function playAudio() {
        if(audioRef.current) {
            (audioRef.current as HTMLAudioElement).play();
        }
    }

    return (
        <>
            <div class="audioplayer">
                <div class="icon">
                    <button class="audioplay" onClick={ playAudio }>
                        {icon === true? <VolumeUpIcon /> : icon }
                    </button>
                </div>
                <audio ref={ audioRef }>
                    <source src={src} type={"audio/" + ext}/>
                </audio>
            </div>
        </>
    );
}