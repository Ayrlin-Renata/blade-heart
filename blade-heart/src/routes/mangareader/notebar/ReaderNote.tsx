import '@/css/mangareader/notebar/note.scss'


import { useState } from 'preact/hooks';

import ReaderNoteContent from './ReaderNoteContent.tsx';
import { createRef } from 'preact';

interface ReaderNote {
    type: string,
    pos: number,
    note: any
}

export default function ({ type, pos, note }: ReaderNote) {
    const [expanded, setExpanded] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const noteRef = createRef(); 

    //@ts-ignore needed for definition
    function toggleExpand( event: any, state: boolean ) {
        //console.log("texp",expand,expand === "true", state);
        var transitionTime = 300; //ms default

        setTransitioning(true);
        setTimeout(() => {
            setTransitioning(false)
        }, transitionTime)
        setExpanded(!state);
    }

    //const mNav = useContext(NavContext);
    // const shownCategories = menuPref.prefs
    //     .filter((pref) => (
    //         pref.value == true
    //         && pref.id.startsWith(mNav.manga.id + "/panel/notes/slider/category/")));
    // const isCategoryShown: boolean = shownCategories.some((pref) => (pref.id.endsWith(note.category)));

    const isCategoryShown = true;

    return (
        <>
            <div class={"readernote " 
                + (isCategoryShown ? "" : "hidden") + " " 
                + (expanded ? "noteexp" : "")}
                data-type={type} 
                data-pos={pos}
                style={ "top:" + pos + "px;" }
                ref={noteRef}>
                <ReaderNoteContent 
                    type={type} 
                    note={note} 
                    expanded={expanded} 
                    transitioning={transitioning} 
                    onClick={ toggleExpand }/>
            </div>
        </>
    );
} 