import { useNavigate } from 'react-router-dom';
import BladeHeartIcon from '../../../components/BladeHeartIcon';

import '@/css/mangareader/menu/readermenuheader.scss';

export default function () {
    const nav = useNavigate();
    
    return (
        <>
            <div class="readermenuheader" onClick={() => nav('/')}>
                <BladeHeartIcon />
                <div class="bh-wordmark">
                    <div>BLADE</div>
                    <div>HEART</div>
                </div>
            </div>
        </>
    )
}