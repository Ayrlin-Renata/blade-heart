import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { createRef } from 'preact';

import '@/css/components/audioplayer.scss';
import { useEffect, useState } from 'preact/hooks';


interface AudioPlayer {
    src: string,
    icon: boolean | any,
    toggle?: boolean,
    offIcon?: boolean | any,
    playOnStart?: boolean,
    loop?: boolean,
}

export default function AudioPlayer({ src, icon, toggle, offIcon, playOnStart, loop }: AudioPlayer) {
    const [tog, setTog] = useState(playOnStart);

    const ext = src.split(".").pop();
    const audioRef = createRef();

    useEffect(() => {
        const ae = (audioRef.current as HTMLAudioElement)
        if (loop) {
            ae.loop = true;
        }
        if (playOnStart) {
            setTimeout(() => {
                ae.play().catch(() => {
                    window.addEventListener('click', wClick)

                    function wClick() {
                        ae.play()
                        window.removeEventListener('click', wClick)
                    }
                })
            }, 1000)
        }
    }, [])

    function handleClick() {
        if (audioRef.current) {
            const ae = (audioRef.current as HTMLAudioElement)
            if (toggle) {
                setTog((prev) => {
                    if (prev) {
                        ae.pause();
                    } else {
                        ae.play();
                    }
                    return !prev
                })
            } else {
                ae.play();
            }
        }
    }

    function handleEnd(_event: any): void {
        if(tog) {
            setTog(false)
        }
    }

    return (
        <>
            <div class={"audioplayer" + (tog ? " playing" : " paused")}>
                <div class="icon">
                    <button class="audioplay" onClick={handleClick}>
                        {(icon === true ?
                            (offIcon === true ?
                                (tog === true ? <VolumeUpIcon /> : <VolumeOffIcon />)
                                : <VolumeUpIcon />)
                            : (toggle ?
                                (offIcon === true ?
                                    (tog === true ? icon : <VolumeOffIcon />)
                                    : (tog === true ? icon : offIcon))
                                : icon))
                        }
                    </button>
                </div>
                <audio ref={audioRef} onEnded={handleEnd}>
                    <source src={src} type={"audio/" + ext} />
                </audio>
            </div>
        </>
    );
}