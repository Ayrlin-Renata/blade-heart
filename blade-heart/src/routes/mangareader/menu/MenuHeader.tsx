import { useNavigate } from 'react-router-dom';
import BladeHeartIcon from '../../../components/icons/BladeHeartIcon';

import '@/css/mangareader/menu/readermenuheader.scss';

export default function () {
    const nav = useNavigate();
    
    return (
        <>
            <div class="readermenuheader" onClick={() => nav('/blade-heart/')}>
                <BladeHeartIcon />
                <div class="bh-wordmark">
                    <div>BLADE</div>
                    <div>HEART</div>
                </div>
            </div>
        </>
    )
}