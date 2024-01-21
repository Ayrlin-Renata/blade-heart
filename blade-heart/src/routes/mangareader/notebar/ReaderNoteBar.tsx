import '@/css/mangareader/notebar/readernotebar.scss'

import { createRef } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";

import { content as contentnotes } from '../../../assets/json/notes.json';

import ReaderNote from './ReaderNote.tsx';
import PageLabel from './PageLabel.tsx';
import { NavContext, ViewContext } from "../Reader.tsx";
import { getMeta } from "@/utils/jsonutils.ts";

export default function () {
    //console.log(mNav, readerView);
    const rView = useContext(ViewContext)
    const mNav = useContext(NavContext)

    const [loadingTimer, setLoadingTimer] = useState(1)
    if (loadingTimer > 0) {
        if (!rView.isLoaded() || rView.viewWidth <= 0) {
            setTimeout(() => setLoadingTimer(loadingTimer + 1), 500)
            //console.log('loading..',rView.isLoaded(), {...rView})

            return (<div>Loading...<div>{loadingTimer}</div></div>)
        } else {
            setLoadingTimer(1)
        }
    }

    const { langMeta, chapMeta, chapNumeral } = getMeta(mNav)

    const pageCount = chapMeta.getPageCount()
    //console.log(pageCount)

    if (!(mNav.chapid)
        || !(chapNumeral)
        || !(pageCount)
    ) {
        console.warn({
            mNav_chapter: mNav.chapid,
        })
        return (<div class="notebarerror">Loading...</div>);
    }

    const mediaData = contentnotes[mNav.mangaid as keyof typeof contentnotes];
    const chapData: any = mediaData.chapters
        .find((ch) => ch.numeral === chapNumeral);

    //    console.log("chapData",chapData);
    if (chapData != undefined && chapData == null) {
        console.warn("could not find notes for chapter", chapNumeral);
        return (<div class="notebarerror">Huh? Unable to load notes for {chapMeta.name}</div>)
    }
    // NOTES
    const noteList = useMemo(() => {
        const nList = []
        const buildQueue = []

        //info note
        const formattedChapNote: string = "## " + langMeta.mangatitle + " \n\n ### "
            + (chapMeta.authornumber ? chapMeta.authornumber + ": " : "")
            + (chapMeta.displayname ? chapMeta.displayname : chapMeta.name) + "\n ### "
            + langMeta.name + "\n\n---\n"
            + "\n\n### Image Source:\n[" + langMeta.sourcecredit + "](" + langMeta.sourcecredit + ")"
            + "\n\n### Credits: " + langMeta.credit.map((cr) =>
                "\n**" + cr.position + ":** " + cr.creditname.join('  ')
            ).join('')
            + "\n\n---\n"
            + (chapMeta.metanotes ?
                "### Source Curator Chapter Notes:\n\n" + chapMeta.metanotes
                : "")
        //console.log(formattedChapNote)
        buildQueue.push({
            "source":"system",
            "language":"system",
            "type": "text",
            "category": "extra",
            "position": 2,
            "content": {
                "title": "Info",
                "text": formattedChapNote
            }
        })

        //expand modals
        chapMeta.suggestzoom.forEach((zoompage) => {
            buildQueue.push({
                "source":"system",
                "language":"system",
                "type": "modal",
                "category": "feature",
                "position": (zoompage-1)*100+5,
                "content": {
                    "title": "Zoom Modal",
                    "text": "",
                    "link": rView.pages[zoompage-1].src
                }
            })
        })

        if (chapData) {  
            //note json
            buildQueue.push(...chapData.notes)
        }
        const noteKeys = Array.from({ length: buildQueue.length }, (_, i) => (chapNumeral + "." + i));

        (buildQueue as Array<any>).sort((n1, n2) => { return n1.position - n2.position });

        let idx = 0;
        for (const note of buildQueue) {
            //console.log('note pos', rView.posToPx(note.position))
            nList.push(
                <>
                    <ReaderNote key={noteKeys[idx]}
                        type={note.type}
                        pos={note.position}
                        note={note} />
                </>
            );
            idx++;
        }
        return nList;
    }, [mNav.chapid, mNav.langid, mNav.mangaid])

    const notebarRef = createRef();

    // PAGELABELS

    const pagelabelRef = createRef();
    const pageLabels = () => {
        return Array.from({ length: pageCount },
            (_, i) => {
                const rv = rView.getView()
                //console.log('ARR', i,rv.heightUpTo(i + 1),rv.pages[i].viewHeight, rv.pages[i].loaded)
                return (
                    <PageLabel pos={rv.heightUpTo(i + 1)} index={i + 1} />
                )
            });
    }

    return (
        <>
            <div class="readernotebar">
                <div class="pagelabelcontainer" ref={pagelabelRef}>{pageLabels()}</div>
                <div class="notecontainer" ref={notebarRef}>{noteList}</div>
            </div>
        </>
    )
}

