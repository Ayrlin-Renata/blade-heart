import { useNavigate } from 'react-router-dom';
import { useState } from 'preact/hooks';
import { idify } from '../../utils/ayrutils.tsx';
import { firstKey, getMangaMeta } from '../../utils/jsonutils.ts';

import '@/css/home/MediaCard.scss'

interface MediaCard {
    children: any,
    type: string,
    title: string,
    id: string,
    desc: string
}

export default function ({ children, type, title, id, desc } : MediaCard) {
    const navigate = useNavigate(); 
    const [broken, setBroken] = useState(false);

    const mangaMeta = getMangaMeta(id);
    const langMeta = mangaMeta.lang();
    const langid = firstKey(mangaMeta.languages);
    const chapterid = idify(langMeta.chap().name || "");
    if(!chapterid) setBroken(true);
    
    function doNav() {
        navigate('/blade-heart/' + type + '/' + id + '/' + langid + '/' + chapterid);
    }

    function noNav() {
        console.warn("user trying to go to broken link rippp");
    }
    
    return (
        <>
        <div class={"bh-mediacard " + (broken? "linkbroken" : "")} onClick={ broken? noNav : doNav }>
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