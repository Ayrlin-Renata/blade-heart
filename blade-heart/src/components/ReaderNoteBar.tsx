import { createRef } from "preact";
import { useContext } from "preact/hooks";
import { MangaNavContext, MangaNavData, ReaderViewContext, ReaderViewData } from "../routes/MangaReader";

import { content as contentnotes } from '../assets/json/notes.json';

import ReaderNote from './ReaderNote.tsx';
import PageLabel from './PageLabel.tsx';

export default function () {
    const mangaNav: MangaNavData = useContext(MangaNavContext);
    const readerView: ReaderViewData = useContext(ReaderViewContext);
    if (!(mangaNav.chapter)
        || !(mangaNav.chapter.numeral)
        || !(mangaNav.chapter.pageCount)
        || !(readerView.height)
        || readerView.height < 100) {
        return (<div class="notebarerror">Loading...</div>);
    }

    const mediaData = contentnotes[mangaNav.title as keyof typeof contentnotes];
    const chapData: any = mediaData.chapters
        .find((ch) => ch.numeral === Number(mangaNav.chapter.numeral));

    if (chapData != undefined && chapData == null) {
        console.warn("could not find notes for chapter", mangaNav.chapter.numeral);
        return (<div class="notebarerror">Huh? Unable to load notes for {mangaNav.chapter.label}</div>)
    }

    const heightBasis = mangaNav.chapter.pageCount ?
        readerView.height / mangaNav.chapter.pageCount
        : NaN;

    // NOTES
    const noteList = [];
    if (chapData) {
        const noteKeys = Array.from({ length: chapData.notes.length }, (_, i) => (mangaNav.chapter.numeral + "." + i));

        (chapData.notes as Array<any>).sort((n1, n2) => { return n1.position - n2.position });

        var idx = 0;
        for (const note of chapData.notes) {
            noteList.push(
                <>
                    <ReaderNote key={noteKeys[idx]}
                        type={note.type}
                        pos={notePosToPx(note.position)}
                        note={note} />
                </>
            );
            idx++;
        }
    }
    const notebarRef = createRef();

    function notePosToPx(npos: number) {
        const pos = Number(npos);
        //console.log(pos, heightBasis)
        return (pos * heightBasis) / 100;
    }

    // PAGELABELS

    const pagelabelRef = createRef();


    const pageLabels = Array.from({ length: mangaNav.chapter.pageCount },
        (_, i) => (
            <PageLabel pos={notePosToPx((i + 1) * 100)} index={i + 1} />

        ));


    return (
        <>
            <div class="readernotebar">
                <div class="pagelabelcontainer" ref={pagelabelRef}>{pageLabels}</div>
                <div class="notecontainer" ref={notebarRef}>{noteList}</div>
            </div>
        </>
    )
}

