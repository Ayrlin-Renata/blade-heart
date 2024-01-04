import { useContext, useEffect } from "preact/hooks";
import { MangaNavContext, MangaNavData, ReaderViewContext, ReaderViewData } from "../routes/MangaReader";

import { content as contentnotes } from '../assets/json/notes.json';

import ChatIcon from '@mui/icons-material/Chat';
import { createRef } from "preact";

export default function () {
    const mangaNav: MangaNavData = useContext(MangaNavContext);

    function loadNotes() {
        if (!mangaNav.chapter || !mangaNav.language) {
            return (<><div>Loading...</div></>)
        }

        const mediaData = contentnotes[mangaNav.title as keyof typeof contentnotes];
        const chapData: any = mediaData.chapters
            .find((ch) => ch.numeral === Number(mangaNav.chapter.value)) || null;

        if (!chapData) {
            console.warn("could not find notes for chapter", mangaNav.chapter.value);
            return (<><div>Huh? Unable to load notes for {mangaNav.chapter.label}</div></>)
        }

        return (
            <>
                {ingestChapterNotes(chapData)}
            </>
        )
    }

    const notebarRef = createRef();
    function placeItems() {
        var heightBasis = 0;

        const mhImage = document.querySelector('.pagecontainer > img');
        if (mhImage) {
            heightBasis = (mhImage as HTMLElement).offsetHeight;
        } else {
            console.warn("unable to refresh item layouts!");
            return false;
        }

        const noteList = notebarRef.current?.children;
        if (noteList) {
            for (const wrapper of noteList) {
                const notemeta = wrapper.getElementsByClassName("notemeta");
                if (notemeta[0]) {
                    // //const noteid = notemeta[0].getElementsByClassName("notemetaid");
                    const notepos = notemeta[0].getElementsByClassName("notemetapos");
                    // //const nid = noteid[0].innerHTML as string;
                    const npos = notepos[0].innerHTML as string;
                    (wrapper as HTMLElement).style.top = notePosToPx(npos, heightBasis) + "px";
                }
            }
        }
    }

    function notePosToPx(npos: number | string, heightBasis: number) {
        const pos = Number(npos);
        return (pos * heightBasis) / 100;
    }


    const readerView: ReaderViewData = useContext(ReaderViewContext);
    useEffect(() => {
        if (readerView.prevHeight != readerView.height) {
            placeItems();
        }
    });

    return (
        <>
            <div class="readernotebar">
                <div class="notecontainer" ref={notebarRef}>{loadNotes()}</div>
            </div>
        </>
    )
}

function ingestChapterNotes(chapData: any) {
    const noteList = [];
    var idx = 1;

    for (const note of chapData.notes) {
        switch (note.type) {
            case "text": {
                const thisidx: number = idx;
                //console.log(note);
                noteList[thisidx] = (
                    <>
                        <div class="notewrapper">
                            <div class="notemeta">
                                <div class="notemetaid">{thisidx}</div>
                                <div class="notemetapos">{note.position}</div>
                            </div>
                            <div id={"note" + thisidx + "icon"} class="noteicon notetypetext">
                                <button onClick={() => {
                                    const cid = "note" + thisidx + "card";
                                    const iid = "note" + thisidx + "icon";
                                    const card = document.getElementById(cid);
                                    const icon = document.getElementById(iid);
                                    if (card?.classList.contains("noteexp")) {
                                        card?.classList.remove("noteexp");
                                        icon?.classList.remove("noteexp");
                                    } else {
                                        card?.classList.add("noteexp");
                                        icon?.classList.add("noteexp");
                                    }
                                }}><ChatIcon /></button>
                            </div>
                            <div id={"note" + thisidx + "card"} class="notecard notetypetext">
                                <h3 class="ntitle"> {note.content.title} </h3>
                                <hr class="nhr" />
                                <p class="ntext"> {note.content.text} </p>
                            </div>
                        </div>
                    </>
                );

            } break;
        }
        idx++;
    }
    //console.log("noteList return",noteList);
    return (<> {noteList} </>)
}
