
import ChatIcon from '@mui/icons-material/Chat';
import MonitorIcon from '@mui/icons-material/Monitor';
import AbcIcon from '@mui/icons-material/Abc';

import { useContext, useState } from 'preact/hooks';
import { MangaNavContext, MenuPrefContext } from '../routes/MangaReader';
import DictionaryNoteEmbed from './DictionaryNoteEmbed.tsx';

interface ReaderNote {
    type: string,
    pos: number,
    note: any
}

export default function ({ type, pos, note }: ReaderNote) {
    const [expand, setExpand] = useState("false");
    const expanded = expand === "true";

    function toggleExpand() {
        //console.log(expanded);
        setExpand((!expanded).toString());
    }

    const menuPref = useContext(MenuPrefContext);
    const mediaNav = useContext(MangaNavContext);
    const shownCategories = menuPref.prefs
        .filter((pref) => (
            pref.value == true
            && pref.id.startsWith(mediaNav.title + "/panel/notes/slider/category/")));
    const isCategoryShown: boolean = shownCategories.some((pref) => (pref.id.endsWith(note.category)));

    var btnIcon: any = (<>{"??"}</>);
    var noteContent: any = (<div class="ntext">invalid note type!</div>);

    switch(type) {
        case "text": {
            btnIcon = (<ChatIcon />);
            noteContent = (<><div class="ntext">{note.content.text}</div></>);
        }  break;
        case "embed": {
            btnIcon = (<MonitorIcon />);
            noteContent = (<>
                {note.content.text ?
                    (<div class="ntext"> {note.content.text} </div>)
                    : (<></>)
                }
                <div class="embedframe">
                    <iframe src={note.content.link}
                        frameborder="0"></iframe>
                </div>
            </>);
        } break;
        case "definition": {
            btnIcon = (<AbcIcon />);
            noteContent = (<>
                {note.content.text ?
                    (<div class="ntext"> {note.content.text} </div>)
                    : (<></>)
                }
                <div class="embedframe">
                    <DictionaryNoteEmbed term={note.content.search}/>
                </div>
            </>);
        } break;
        default: {


        }
    }



    return (
        <>
            <div class={"readernote " + (isCategoryShown ? "" : "hidden")}
                data-type={type} data-pos={pos}>
                <div class={"noteicon notetype" + type + " " + (expanded ? "noteexp" : "")} onClick={toggleExpand}>
                    <button>
                        { btnIcon }
                    </button>
                </div>
                <div class={"notecardwrapper " + (expanded ? "noteexp" : "")}>
                    <div class={"notecard notetype" + type}>
                        <h3 class="ntitle"> {note.content.title} </h3>
                        { noteContent }
                    </div>
                    <div class="credit" style={(!note.credit) ? "display: none" : ""}> {"- " + (note.credit?.join(", ") || "")} </div>
                </div>
            </div>
        </>
    );
} 