import '@/css/mangareader/notebar/readernotebar.scss'

import { createRef } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";

import { content as contentnotes } from '../../../assets/json/notes.json';

import ReaderNote from './ReaderNote.tsx';
import PageLabel from './PageLabel.tsx';
import { NavContext, ViewContext } from "../Reader.tsx";
import { getMeta } from "@/utils/jsonutils.tsx";

export default function () {
    //console.log(mNav, readerView);
    const rView = useContext(ViewContext)
    const mNav = useContext(NavContext)

    const [loadingTimer, setLoadingTimer] = useState(1)
    if (loadingTimer > 0 ) {
        if (!rView.isLoaded() || rView.viewWidth <= 0) {
            setTimeout(() => setLoadingTimer(loadingTimer + 1), 500)
            //console.log('loading..',rView.isLoaded(), {...rView})

            return (<div>Loading...<div>{loadingTimer}</div></div>)
        } else {
            setLoadingTimer(1)
        }
    }

    const {
        // mangaMeta, langMeta, 
        chapMeta, chapNumeral } = getMeta(mNav)

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
        if (chapData) {
            const noteKeys = Array.from({ length: chapData.notes.length }, (_, i) => (chapNumeral + "." + i));

            (chapData.notes as Array<any>).sort((n1, n2) => { return n1.position - n2.position });
            
            let idx = 0;
            for (const note of chapData.notes) {
                //console.log('note pos', rView.posToPx(note.position))
                nList.push(
                    <>
                        <ReaderNote key={noteKeys[idx]}
                            type={note.type}
                            pos={rView.posToPx(note.position)}
                            note={note} />
                    </>
                );
                idx++;
            }
        }
        return nList;
    },[mNav.mangaid, mNav.langid, mNav.chapid])

    const notebarRef = createRef();

    // PAGELABELS

    const pagelabelRef = createRef();
    const pageLabels = () => {
        return Array.from({ length: pageCount },
            (_, i) => {
                //console.log('ARR', i,rView.heightUpTo(rView, i + 1),rView.pages[i].viewHeight, rView.pages[i].loaded)
                return (
                    <PageLabel pos={rView.heightUpTo(rView, i + 1)} index={i + 1} />
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

