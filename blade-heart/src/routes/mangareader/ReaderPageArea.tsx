import '@/css/mangareader/readerpagearea.scss'

import { useState, useContext, useEffect, useMemo } from 'preact/hooks';
import { Resizable } from 're-resizable';

import { createRef } from 'preact';
import { numeralFromNav, getMeta } from '../../utils/jsonutils';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavContext, ReaderView, ViewContext } from './Reader';
import { idify } from '@/utils/ayrutils';

export default function () {
    const mNav = useContext(NavContext)

    const bhurl: string = mNav.mangaid + "/readerpagearea/width";
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
        rView.update(rView)
        //updateView();
    }

    const {
        //mangaMeta, 
        langMeta,
        //chapMeta,
        //chapNumeral 
    } = getMeta(mNav)

    const rView = useContext(ViewContext);
    const pageContainerRef = createRef();

    useEffect( () => {
        if(pageContainerRef.current) {
            const pcr = pageContainerRef.current as HTMLElement
            const resizeObserver = new ResizeObserver(() => {
                rView.viewWidth = pcr.offsetWidth
            });
            resizeObserver.observe(pcr);
        }
    },[])

    const [, setLoadedPages] = useState(0)

    function doneLoading(rv: ReaderView) {
        setLoadedPages((loadedPages) => {
            //console.log(loadedPages, rv.pages.length)
            if(loadedPages == rv.pages.length - 1 && rv.isLoaded()) {
                rv.update(rv)
            }
            return loadedPages + 1
        })
    }

    const loadPages = useMemo(() => {
        //console.log('loadPages', {...rView})
        if (!rView.pages) {
            return (<div>Loading...</div>)
        }
        setLoadedPages(0)
        return rView.pages
            .map((page) => {
                const image = page.getImg()

                const imgRef = createRef()

                function handleLoad() {
                    //console.log('load' , page)
                    const hir = (imgRef.current as HTMLImageElement)
                    if(!hir || !hir.naturalHeight || !hir.naturalWidth || !hir.offsetHeight || hir.offsetHeight == 0) {
                        setTimeout(() => handleLoad(), 100)
                        return
                    }
                    page.origSize.height = hir.naturalHeight
                    page.origSize.width = hir.naturalWidth
                    page.viewHeight = hir.offsetHeight

                    const resizeObserver = new ResizeObserver(() => {
                        page.viewHeight = hir.offsetHeight
                    });
                    page.loaded = true;

                    resizeObserver.observe(hir)
                    doneLoading(rView)
                    //rView.update(rView)
                }

                return (
                    <img key={image.src}
                        ref={imgRef}
                        id={image.id}
                        src={image.src}
                        onLoad={handleLoad} />
                )
            })
    }, [mNav.chapid, mNav.langid, mNav.mangaid])

    const navigate = useNavigate();
    const loc = useLocation();

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
                    <div class="pagecontainer" ref={pageContainerRef}>{loadPages}</div>
                    <div class="pagebottom">
                        <button class="nextchap"
                            onClick={() => {

                                //document.getElementsByClassName('mainscreen')[0].scrollTop = 0;
                                rView.scrollTo('px',0)
                                const dest = loc.pathname.split('/').slice(0, -1).join('/') + '/' + idify(langMeta.chap((numeralFromNav(mNav) + 1)).name);
                                //console.log(dest);
                                navigate(dest);
                            }}>NEXT CHAPTER</button>
                    </div>
                </div>
            </Resizable>
        </>
    )
}
