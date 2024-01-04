
import ChatIcon from '@mui/icons-material/Chat';
import { useState } from 'preact/hooks';

interface ReaderNote {
    type: string,
    pos: number,
    content: any
}

export default function ( { type, pos, content } : ReaderNote ) {
    const [ expand, setExpand ] = useState("false");
    const expandBool = expand === "true";
    
    function toggleExpand() {
        console.log(expandBool);
        setExpand((!expandBool).toString());
    }

    return (
        <>
            <div class="readernote" data-type={type} data-pos={pos}>
                <div class={"noteicon notetypetext " + (expandBool ? "noteexp" : "")} onClick={ toggleExpand }>
                    <button><ChatIcon /></button>
                </div>
                <div class={"notecard notetypetext " + (expandBool ? "noteexp" : "")}>
                    <h3 class="ntitle"> {content.title} </h3>
                    <hr class="nhr" />
                    <p class="ntext"> {content.text} </p>
                </div>
            </div>
        </>
    );
} 