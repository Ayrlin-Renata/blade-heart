import { useMemo } from "preact/hooks";
import DictionaryNoteEmbed from "./DictionaryNoteEmbed";

import ChatIcon from '@mui/icons-material/Chat';
import MonitorIcon from '@mui/icons-material/Monitor';
import AbcIcon from '@mui/icons-material/Abc';

interface ReaderNoteContent {
    type: string,
    note: any,
    expanded: boolean,
    onClick: (event: MouseEvent, expanded: boolean) => void
}

export default function ({ type, note, expanded, onClick }: ReaderNoteContent) {

    const result = useMemo(() => {
        var btnIcon: any = (<>{"??"}</>);
        var noteContent: any = (<div class="ntext">invalid note type!</div>);

        switch (type) {
            case "text": {
                btnIcon = (<ChatIcon />);
                noteContent = (<><div class="ntext">{note.content.text}</div></>);
            } break;
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
                        <DictionaryNoteEmbed term={note.content.search} />
                    </div>
                </>);
            } break;
            default: {


            }
        }


        return { btnIcon, noteContent }
    }, [type, note])

    return (
        <>
            <div class={"noteicon notetype" + type} onClick={(event) => onClick(event, expanded)}>
                <button>
                    {result.btnIcon}
                </button>
            </div>
            <div class="notecardwrapper">
                {expanded ? useMemo(() => (
                    <>
                        <div class={"notecard notetype" + type}>
                            <h3 class="ntitle"> {note.content.title} </h3>
                            {result.noteContent}
                        </div>
                        <div class="credit" style={(!note.credit) ? "display: none" : ""}> {"- " + (note.credit?.join(", ") || "")} </div>
                    </>
                ),[result.noteContent])
                    : ""
                }
            </div>
        </>
    );
}