import { useContext, useEffect, useState } from 'preact/hooks';
import { Resizable } from 're-resizable';
import { MangaNavContext, MangaNavData, ReaderViewContext, ReaderViewData } from '../routes/MangaReader';
import { createRef } from 'preact';


export default function () {
    const mangaNav: MangaNavData = useContext(MangaNavContext);
    const readerView: ReaderViewData = useContext(ReaderViewContext);

    const bhurl: string = mangaNav.title + "/readerplaybar/width";
    const [remWidth] = useState(localStorage.getItem(bhurl) || "50px");

    const contentstyle = {
        display: "flex",
        justifyContent: "center",
        background: "#000000"
    } as const;

    const handlestyle = {
        height: "100vh",
        width: "15px",
        marginTop: "-1px",
        borderRadius: "2px",
        transition: "background-color 0.2s ease-in-out",
    } as const;

    // @ts-ignore: need params for definition
    function handleResizeStop(event: MouseEvent | TouchEvent, direction: string, refToElement: HTMLElement, delta: any) {
        localStorage.setItem(bhurl, refToElement.offsetWidth.toString() + "px");
    }

    const playbar = createRef();
    useEffect(() => {
        const pbe: HTMLDivElement = playbar.current;
        var pbeparent: HTMLElement | null = null;
        
        if (pbe) {
            pbe.style.height = readerView.height.toString() + "px";
            pbeparent = pbe.parentElement;
        }
        var scrollListener: any;
        if (pbeparent) {
            scrollListener = () => {
                if(pbeparent) {
                    //readerView.setScroll(pbeparent.scrollTop);
                    readerView.scroll = pbeparent.scrollTop;
                    readerView.setReaderView(readerView);
                }
            }
            pbeparent.addEventListener('scroll', scrollListener)
        }
        return () => pbeparent?.removeEventListener('scroll', scrollListener);
    });

    return (
        <>
            <Resizable
                className="resizable re-readerplaybar"
                style={contentstyle}
                defaultSize={{
                    width: remWidth,
                    height: '100vh'
                }}
                minWidth={'10vw'}
                maxWidth={'30vw'}
                minHeight={'100vh'}
                maxHeight={'100vh'}
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                handleClasses={{ right: "righthandle" }}
                handleStyles={{ right: handlestyle }}
                onResizeStop={handleResizeStop}
            >
                <div class="readerplaybar" >
                    <div ref={playbar}>PLAY BAR</div>
                </div>
            </Resizable>
        </>
    )
}