import '@/css/components/pagemenu.scss'

import { useState } from 'preact/hooks';
import AudioPlayer from './AudioPlayer';

import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import BladeHeartIcon from './icons/BladeHeartIcon';

interface PageMenu {
    children: any,
}

export default function ({ children }: PageMenu) {
    const [showMenu, setShowMenu] = useState(false);

    function toggleShowMenu(event: any): void {
        setShowMenu((prev) => !prev)
    }

    return (
        <>
            <div class="menu">
                <div class="topbar">
                    <MenuIcon onClick={toggleShowMenu} />
                    <div class="midtitle">
                        <BladeHeartIcon />
                        <div>
                            BLADE HEART
                        </div>
                    </div>
                    <AudioPlayer src="https://act-webstatic.mihoyo.com/event_bh3_com/avg-anti-entropy/static_CN/baseDurandal/resources/sound/theme.mp3"
                        icon={<MusicNoteIcon />}
                        offIcon={<MusicOffIcon />}
                        toggle
                        loop
                        playOnStart />
                </div>
                <menu class={"menubar" + (showMenu ? " active" : "")}>
                    {children}
                </menu>
            </div>
        </>
    )
}