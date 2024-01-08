

import { useContext, useState } from 'preact/hooks';
import { MangaNavContext, MenuPrefContext } from '../routes/ChapterReader.tsx';

import ReaderNoteContent from './ReaderNoteContent.tsx';

interface ReaderNote {
    type: string,
    pos: number,
    note: any
}

export default function ({ type, pos, note }: ReaderNote) {
    const [expand, setExpand] = useState("false");
    const expanded = expand === "true";

    //@ts-ignore needed for definition
    function toggleExpand( event: any, state: boolean ) {
        //console.log("texp",expand,expand === "true", state);
        setExpand((!(state)).toString());
    }

    const menuPref = useContext(MenuPrefContext);
    const mediaNav = useContext(MangaNavContext);
    const shownCategories = menuPref.prefs
        .filter((pref) => (
            pref.value == true
            && pref.id.startsWith(mediaNav.title + "/panel/notes/slider/category/")));
    const isCategoryShown: boolean = shownCategories.some((pref) => (pref.id.endsWith(note.category)));

    return (
        <>
            <div class={"readernote " + (isCategoryShown ? "" : "hidden") + " " + (expanded ? "noteexp" : "")}
                data-type={type} 
                data-pos={pos}
                style={ "top:" + pos + "px;" }>
                <ReaderNoteContent type={type} note={note} expanded={expanded} onClick={ toggleExpand }/>
            </div>
        </>
    );
} 