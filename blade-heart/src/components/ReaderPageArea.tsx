import { useState, useContext, useEffect, useMemo } from 'preact/hooks';
import { Resizable } from 're-resizable';
import { MangaNavContext, MangaNavData, ReaderViewContext, ReaderViewData } from '../routes/ChapterReader';

import { content as contentmeta } from '../assets/json/contentmeta.json';
import { VNode, createRef } from 'preact';

export default function () {
    const mangaNav: MangaNavData = useContext(MangaNavContext);

    const bhurl: string = mangaNav.title + "/readerpagearea/width";
    const [remWidth] = useState(localStorage.getItem(bhurl) || "50vw");

    const contentstyle = {
        display: "flex",
        justifyContent: "center",
        height: "fit-content",
        background: "#000000"
    } as const;

    const handlestyle = {
        height: "100%",
        width: "15px",
        marginTop: "-1px",
        borderRadius: "2px",
        transition: "background-color 0.2s ease-in-out",
    } as const;

    // @ts-ignore: need these unused params bc of the type definition 
    function handleResizeStop(event: MouseEvent | TouchEvent, direction: string, refToElement: HTMLElement, delta: any) {
        localStorage.setItem(bhurl, refToElement.offsetWidth.toString() + "px");
        updateView();
    }

    function loadPages() {
        if (!mangaNav.chapter || !mangaNav.language) {
            return (<><div>Loading...</div></>)
        }

        return useMemo(() => {
            const mediaData = contentmeta[mangaNav.id as keyof typeof contentmeta];
            const chapData: object = mediaData.chapters
                .find((ch) => ch.numeral === mangaNav.chapter.numeral) || {};

            if (!chapData) {
                console.error("could not find chapter", mangaNav.chapter.numeral);
                return (<><div class=".noteserror">Huh? Unable to load pages for {mangaNav.chapter.label}</div></>)
            }

            const langData = mediaData.languages.find((ld) => ld.lang.toLowerCase() === mangaNav.language.toLowerCase());
            if (!langData) {
                console.error("could not find", mangaNav.language, "language data for chapter", mangaNav.chapter.numeral);
                return (<><div class=".noteserror">Huh? Missing {mangaNav.language} language data for {mangaNav.chapter.label}</div></>)
            }

            const loadCallback = () => {
                //console.log("hi");
            }
            const pages: Array<VNode<any>> = ingestChapterSources(langData, chapData, loadCallback) as Array<VNode<any>>;
            if (mangaNav.chapter.pageCount != pages.length) {
                mangaNav.chapter.pageCount = pages.length;
                mangaNav.setMangaNav(mangaNav);
            }

            return (
                <>
                    {pages}
                </>
            )
        }, [mangaNav.chapter]);
    }

    const pageContainerRef = createRef();

    const readerView: ReaderViewData = useContext(ReaderViewContext);

    useEffect(() => {
        //console.log("afterImgLoad", pageContainerRef.current)
        function waitUpdateView() {
            //console.log('ref..', pageContainerRef.current?.offsetHeight);
            if (pageContainerRef.current
                && pageContainerRef.current.children.length > 0
                && pageContainerRef.current.offsetHeight > 200) {
                updateView();
            } else {
                //setTimeout(waitUpdateView,10000);
            }
        }
        setTimeout(waitUpdateView,500)
        //waitUpdateView();
    }, [pageContainerRef])

    function updateView() {
        if (pageContainerRef.current) {
            if (pageContainerRef.current.offsetHeight != readerView.height) {
                readerView.prevHeight = readerView.height;
                readerView.height = pageContainerRef.current.offsetHeight;
                readerView.setReaderView(readerView);
            }
        }
    }

    //console.log("render")

    //const navigate = useNavigate(); 

    return (
        <>
            <Resizable
                className="resizable re-readerpagearea"
                style={contentstyle}
                defaultSize={{
                    width: remWidth,
                    height: 'fit-content'
                }}
                minWidth={'200px'}
                maxWidth={'80vw'}
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                handleClasses={{ right: "righthandle" }}
                handleStyles={{ right: handlestyle }}
                onResizeStop={handleResizeStop}
            >
                <div class="readerpagearea">
                    <div class="pagecontainer" ref={pageContainerRef}>{loadPages()}</div>
                    <div class="pagebottom">
                        <button class="nextchapter"
                            onClick={() => {
                                const dest = mangaNav.readerLocation?.pathname;
                                console.log(dest);
                                //navigate();
                            }}>NEXT CHAPTER</button>
                    </div>
                </div>
            </Resizable>
        </>
    )
}


function ingestChapterSources(lang: any, chapterData: any, loadCallback: Function): Array<VNode<any>> {
    const langsource = lang.sourceurl;
    const { pagemethod, pagedata, numeral, imageext } = chapterData;
    const imgs: Array<VNode<any>> = [] as Array<VNode<any>>;
    const pageClass = "mangapage";

    switch (pagemethod) {
        case "fetch-source": {
            const pagestart = pagedata[0] as number;
            const pageend = pagedata[1] as number;

            for (let i = pagestart; i <= pageend; i++) {
                const url = langsource + numeral + "/" + i.toString().padStart(4, '0') + "." + imageext;
                imgs[i] = (<img id={"page" + (i)} src={url} type={"image/"+imageext} class={pageClass} onLoad={loadCallback()}></img>);
            }
        } break;
        case "patch-source": {
            let i = 1;
            for (const val of pagedata) {
                if (typeof val === "string") {
                    imgs[i] = (<img id={"page" + (i)} src={val} type={"image/"+imageext} class={pageClass} onLoad={loadCallback()}></img>);
                    i++;
                } else if (Array.isArray(val)) {
                    for (let j = val[0]; j <= val[1]; j++) {
                        const url = langsource + numeral + "/" + j.toString().padStart(4, '0') + "." + imageext;
                        imgs[i] = (<img id={"page" + (i)} src={url} type={"image/"+imageext} class={pageClass} onLoad={loadCallback()}></img>);
                        i++;
                    }
                }
            }
        } break;
        default:
            console.error('unknown page retrieval method:', pagemethod);
            return [(<div>Huh? Someone messed up the directions for retrieving the pages.</div>)] as Array<VNode<any>>
    }

    return imgs.filter((im) => im) as Array<VNode<any>>;
}