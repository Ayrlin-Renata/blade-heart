import { useNavigate } from 'react-router-dom';

export default function ({ children, type, title, desc } : { children: any, type: string, title: string, desc: string }) {
    const navigate = useNavigate(); 
    function doNav() {
        navigate('/blade-heart/' + type + '/' + title);
    }
    
    return (
        <>
        <div class="bh-mediacard" onClick={ doNav }>
            { children }
            <div class="details">
                <p class="title">{ title }</p>
                <p class="type">{ type }</p>
                <p class="desc">{ desc }</p>
            </div>
        </div>
        </>
    )
}