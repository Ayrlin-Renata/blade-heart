import { createRef } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { MangaNavContext, MangaNavData, ReaderViewContext, ReaderViewData } from "../routes/MangaReader";

import { content as contentnotes } from '../assets/json/notes.json';

import ReaderNote from './ReaderNote.tsx';

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

        // const mediaData = contentmeta[mangaNav.title as keyof typeof contentmeta];
        // const chapData = mediaData.chapters.find((s) => Number(mangaNav.chapter.value) === s.numeral);
        // heightBasis = readerView.height/(chapData?.pagedata[1] || 1);

        // console.log(heightBasis,readerView.height,(chapData?.pagedata[1] || 1));
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
                (wrapper as HTMLElement).style.top = notePosToPx(wrapper.dataset.pos, heightBasis) + "px";
            }
        }
    }

    function notePosToPx(npos: number, heightBasis: number) {
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
    (chapData.notes as Array<any>).sort((n1,n2) => { return n1.position - n2.position });
    for (const note of chapData.notes) {
        noteList.push(
            <>
                <ReaderNote type={note.type} pos={note.position} note={note}></ReaderNote>
            </>
        );

    }
    return (<> {noteList} </>)
}
