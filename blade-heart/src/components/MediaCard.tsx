import { useNavigate } from 'react-router-dom';

interface MediaCard {
    children: any,
    type: string,
    title: string,
    id: string,
    desc: string
}

export default function ({ children, type, title, id, desc } : MediaCard) {
    const navigate = useNavigate(); 
    function doNav() {
        navigate('/blade-heart/' + type + '/' + id);
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