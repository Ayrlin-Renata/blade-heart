import { useContext, useEffect } from "preact/hooks";
import { ReaderViewData, ReaderViewContext } from "../routes/MangaReader";
import { createRef } from "preact";


export default function () {
    const readerView: ReaderViewData = useContext(ReaderViewContext);

    const notebar = createRef();
    useEffect(() => {
        const nbe: HTMLDivElement = notebar.current;
        if (nbe) {
            nbe.style.height = readerView.height.toString() + "px";
            const nbeparent = nbe.parentElement;
            if(nbeparent) {
                nbeparent.scrollTop = readerView.scroll;
            }
        }
    });

    return (
        <>
            <div class="readernotebar">
                <div ref={notebar}>NOTE BAR</div>
            </div>
        </>
    )
}