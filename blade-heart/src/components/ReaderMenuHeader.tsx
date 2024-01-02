import { useNavigate } from 'react-router-dom';
import BladeHeartIcon from './BladeHeartIcon';

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