import '@/css/mangareader/notebar/note.scss'


import { useContext, useEffect, useState } from 'preact/hooks';

import ReaderNoteContent from './ReaderNoteContent.tsx';
import { createRef } from 'preact';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUserdata } from '@/utils/firebase.ts';
import { NavContext } from '../Reader.tsx';

interface ReaderNote {
    type: string,
    pos: number,
    note: any
}

export default function ({ type, pos, note }: ReaderNote) {
    const [expanded, setExpanded] = useState(false);
    const [visible, setVisible] = useState('h' as 'v' | 'h' | '');
    const [transitioning, setTransitioning] = useState(false);

    const noteRef = createRef();

    //@ts-ignore needed for definition
    function toggleExpand(event: any, state: boolean) {
        //console.log("texp",expand,expand === "true", state);
        transition()
        setExpanded(!state);
    }

    function transition() {
        var transitionTime = 300; //ms default
        setTransitioning(true);
        setTimeout(() => {
            setTransitioning(false)
        }, transitionTime)
    }

    // const mNav = useContext(NavContext);
    // const shownCategories = menuPref.prefs
    //     .filter((pref) => (
    //         pref.value == true
    //         && pref.id.startsWith(mNav.manga.id + "/panel/notes/slider/category/")));
    // const isCategoryShown: boolean = shownCategories.some((pref) => (pref.id.endsWith(note.category)));

    useEffect(() => {
        onAuthStateChanged(getAuth(), () => {
            setVisible('')
        })
    }, [])

    const mNav = useContext(NavContext)
    const keystring = mNav.mangaid + '|pnl|notes|sld|ctg|' + note.category

    const { status, data } = useUserdata()
    if (status == undefined) {
        //guest user
    } else if (status === 'success') {
        const bstr = data.prefs[keystring] ? 'v' : 'h'
        if (bstr != visible) {
            setVisible(bstr)
        }
    }

    return (
        <>
            <div class={"readernote"
                + ((visible == 'v') ? "" : " hidden")
                + (expanded ? " noteexp" : "")}
                //data-type={type} 
                //data-pos={pos}
                style={"top:" + pos + "px;"}
                ref={noteRef}>
                <ReaderNoteContent
                    type={type}
                    note={note}
                    expanded={expanded}
                    transitioning={transitioning}
                    onClick={toggleExpand} />
            </div>
        </>
    );
} 