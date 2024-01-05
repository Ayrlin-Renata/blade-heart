
import ChatIcon from '@mui/icons-material/Chat';
import { useContext, useState } from 'preact/hooks';
import { MangaNavContext, MenuPrefContext } from '../routes/MangaReader';

interface ReaderNote {
    type: string,
    pos: number,
    note: any
}

export default function ({ type, pos, note }: ReaderNote) {
    const [expand, setExpand] = useState("false");
    const expanded = expand === "true";

    function toggleExpand() {
        console.log(expanded);
        setExpand((!expanded).toString());
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
            <div class={"readernote " + (isCategoryShown ? "" : "hidden")}
                data-type={type} data-pos={pos}>
                <div class={"noteicon notetypetext " + (expanded ? "noteexp" : "")} onClick={toggleExpand}>
                    <button><ChatIcon /></button>
                </div>
                <div class={"notecardwrapper " + (expanded ? "noteexp" : "")}>
                    <div class="notecard notetypetext">
                        <h3 class="ntitle"> {note.content.title} </h3>
                        <hr class="nhr" />
                        <p class="ntext"> {note.content.text} </p>
                    </div>
                    <div class="credit" style={(!note.credit) ? "display: none" : ""}> {"- " + (note.credit?.join(", ") || "")} </div>
                </div>
            </div>
        </>
    );
} 