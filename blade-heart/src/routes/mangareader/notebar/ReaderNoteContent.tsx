import { useMemo } from "preact/hooks";
import DictionaryNoteEmbed from "./DictionaryNoteEmbed";
import Markdown, { defaultUrlTransform } from 'react-markdown'

import ChatIcon from '@mui/icons-material/Chat';
import MonitorIcon from '@mui/icons-material/Monitor';
import AbcIcon from '@mui/icons-material/Abc';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

import Modal, { openModal } from "@/components/Modal";

interface ReaderNoteContent {
    type: string,
    note: any,
    expanded: boolean,
    transitioning: boolean,
    onClick: (event: MouseEvent, expanded: boolean) => void
}

export default function ({ type, note, expanded, transitioning, onClick }: ReaderNoteContent) {

    
    const result = useMemo(() => {
        var btnIcon: any = (<>{"??"}</>);
        var noteContent: any = (<div class="ntext">invalid note type!</div>);
        var clickfn: ((event:any) => void) | null = null;

        switch (type) {
            case "text": {
                btnIcon = (<ChatIcon />);
                noteContent = (
                    <>
                        <Markdown className="ntext"
                            urlTransform={defaultUrlTransform}>{note.content.text}</Markdown>
                    </>
                );
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
            case "modal": {
                btnIcon = (<OpenInFullIcon />);
                noteContent = (<>
                    {note.content.text ?
                        (<div class="ntext"> {note.content.text} </div>)
                        : (<></>)
                    }
                </>);
                clickfn = () => {
                    openModal(
                        <Modal altText={note.content.text} fullview>
                            <img src={note.content.link}></img>
                        </Modal>
                    )
                }
            } break;
            default: {


            }
        }


        return { btnIcon, noteContent, clickfn }
    }, [type, note])

    return (
        <>
            <div class={"noteicon notetype" + type} onClick={result.clickfn? result.clickfn : (event) => onClick(event, expanded)}>
                <button tabindex={-1}>
                    {result.btnIcon}
                </button>
            </div>
            <div class="notecardwrapper">
                {!expanded && !transitioning ?
                    "" : useMemo(() => (
                        <>
                            <div class={"notecard notetype" + type}>
                                <h3 class="ntitle"> {note.content.title} </h3>
                                {result.noteContent}
                            </div>
                            <div class="credit" style={(!note.credit) ? "display: none" : ""}> {"- " + (note.credit?.join(", ") || "")} </div>
                        </>
                    ), [result.noteContent])
                }
            </div>
        </>
    );
}