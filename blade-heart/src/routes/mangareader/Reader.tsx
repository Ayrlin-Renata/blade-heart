import { useEffect, useState } from 'preact/hooks';

import ReaderPlayBar from './ReaderPlayBar';
import ReaderPageArea from './ReaderPageArea';
import ReaderNoteBar from './notebar/ReaderNoteBar';
import ReaderMenu from './menu/ReaderMenu';

import '@/css/mangareader/mangareader.scss'
import { useLocation } from 'react-router-dom';
import { getIdsFromUrl as splitLocation } from '@/utils/urlutils';
import { createContext, createRef } from 'preact';
import { Size2, loadPageMeta as loadPageMeta } from '@/utils/jsonutils';
import { debounce } from 'lodash';
import Loading from '@/components/Loading';

export const NavContext = createContext({} as MangaNav)

export interface MangaNav {
    mangaid: string,
    langid: string,
    chapid: string,
}

export const ViewContext = createContext({} as ReaderView)

export interface ReaderView {
    rvVer: number,
    getView: () => ReaderView,
    viewWidth: number,
    viewScroll: number,
    scrollRef: any,
    pages: ReaderPage[],
    heightUpTo: (pageidx?: number) => number,
    posToPx: (pos: number) => number,
    scrollTo: (unit: 'px' | 'pos', value: number, instant?: boolean) => void,
    isLoaded: () => boolean,
    loadQueue: { id: string, fun: (rView: ReaderView) => void }[],
    addToLoadQueue: ({ id, fun }: { id: string, fun: (rView: ReaderView) => void }) => void,
    runAfterLoad: () => void,
    update: (rv: ReaderView) => void,
}

export interface ReaderPage {
    numeral: number,
    src: string,
    origSize: Size2,
    viewHeight: number, //width from ReaderView
    suggestZoom?: boolean, //for multi-page layouts and oddly-dimensioned pages
    noPageGap?: boolean,
    getImg: () => HTMLImageElement,
    loaded: boolean,
}

var lastLocation: MangaNav = {} as MangaNav

export default function MangaReader() {
    //States
    const [loadingTimer, setLoadingTimer] = useState(1)
    const [menuCollapsed, setMenuCollapsed] = useState(false)

    //Context
    const loc = useLocation()
    const lids = splitLocation(loc)

    const mNav: MangaNav = {
        ...lids,
    }

    const rvRef = createRef()
    const scrollRef = createRef()

    const [rView, setRView] = useState({
        rvVer: 0,
        getView: getView,
        viewWidth: 0,
        viewScroll: 0,
        scrollRef: scrollRef,
        pages: loadPageMeta(mNav),
        heightUpTo: heightUpTo,
        posToPx: posToPx,
        scrollTo: scrollTo,
        isLoaded: isRViewLoaded,
        loadQueue: [] as { id: string, fun: (rView: ReaderView) => void }[],
        addToLoadQueue: addToLoadQueue,
        runAfterLoad: runAfterLoad,
        update: updateRV,
    })

    if (lastLocation && !(JSON.stringify(lastLocation) == JSON.stringify(mNav))) {
        //console.log('tes',rView)
        rView.pages = loadPageMeta(mNav)
        rView.update(rView)

    }
    lastLocation = mNav

    function getView() {
        //console.log("GET VIEW: ", rvRef.current)
        return rvRef.current || rView
    }

    //viewScroll
    useEffect(() => {
        const sr = { ...scrollRef }
        const ele = scrollRef.current
        const handleScroll = (curEle: HTMLElement) => {
            if (curEle) {
                rView.viewScroll = curEle.scrollTop
                rView.scrollRef = sr
                //console.log("rvSR", rView.scrollRef)
                rView.update(rView)
            }
        };

        const debHS = debounce(() => {
            handleScroll(ele)
        }, 500)

        ele?.addEventListener('scroll', debHS);

        // Cleanup function 
        return () => {
            ele?.removeEventListener('scroll', debHS);
        };
    }, [rView])

    function scrollTo(unit: 'px' | 'pos', value: number, instant?: boolean): void {
        const rv = getView()
        //console.log("SCROLLTO", unit, value, rv.scrollRef, rv.scrollRef.current)
        if (rv.scrollRef.current) {
            const htRef = rv.scrollRef.current as HTMLElement
            var pix: number;
            if (unit === 'px') {
                pix = value
            } else {
                pix = posToPx(value)
            }
            htRef.scrollTo({
                top: pix,
                behavior: instant ? 'instant' : 'smooth',
            })
        }
    }

    function heightUpTo(pageidx?: number): number {
        if (pageidx == 0) return 0
        const rv = getView()
        if (!pageidx) pageidx = rv.pages.length + 1
        if (!pageidx) return NaN

        let heightCount: number = 0
        //console.log('HUT',{...rView})
        for (let idx = 0; idx < pageidx; idx++) {
            //console.log('hut',rView.pages[idx].viewHeight, heightCount, idx)
            if (!rv.pages[idx]) {
                console.warn("page", idx, "doesnt exist in rView")
                return NaN
            }
            if (!rv.pages[idx].viewHeight) {
                console.warn("page", idx, "doesnt have a viewHeight")
                return NaN
            }
            heightCount += rv.pages[idx].viewHeight + 3 //readerpagearea.scss .pagecontainer gap
        }

        return heightCount
    }

    function posToPx(pos: number): number {
        //console.log({...rView})
        const rv = getView()
        const pageidx = Math.floor(pos / 100)
        const pageHeight = rv.pages[pageidx].viewHeight
        const pagePos = Number(pos.toString().padStart(2, '0').slice(-2))
        return heightUpTo(pageidx) + ((pageHeight / 100) * pagePos)
    }

    function isRViewLoaded() {
        const rv = getView()
        if(!rv.pages) return false
        //console.log('comp',{...rView})
        //const widthLoaded = (rView.viewWidth > 0)
        const pagesLoaded = rv.pages.every((page:ReaderPage) => page.loaded === true)
        //console.log(widthLoaded, pagesLoaded)
        return pagesLoaded
    }

    function addToLoadQueue({ id, fun }: { id: string, fun: (rView: ReaderView) => void }) {
        const rv = getView()
        //console.log("adding to loadQueue", { id, fun })
        for (const rou of rv.loadQueue) {
            if (rou.id === id) {
                rou.fun = fun
                return;
            }
        }
        rView.loadQueue.push({ id: id, fun: fun })
    }

    function runAfterLoad() {
        //console.log('LOADEDED')
        const rv = getView()
        for (const entry of rView.loadQueue) {
            entry.fun(rv)
        }
        rv.update(rv)
    }

    function updateRV(rv: ReaderView) {
        //console.log("rView Update", rView, rv)
        //console.trace()
        //console.log("rView Update", rv.viewScroll, rv.scrollRef, rv.loadQueue, rv.rvVer + 1)
        rvRef.current = rv
        setRView({
            ...rv,
            getView: getView,
            rvVer: rv.rvVer + 1
        })
    }

    // console.log(!rView.isLoaded())
    // console.log("RENDER")

    const isLoading: boolean = ((!mNav || !(mNav.chapid)) && loadingTimer > 0);
    if (!isLoading) {
        return (
            <>
                <NavContext.Provider value={mNav}>
                    <ViewContext.Provider value={rView}>
                        <div id="mangareader">
                            <div class="mainscreen" ref={scrollRef}>
                                <div class="maininner">
                                    <ReaderPlayBar />
                                    <ReaderPageArea />
                                    <ReaderNoteBar />
                                    <div class={menuCollapsed ? "notespacer collapsed" : "notespacer"}></div>
                                </div>
                                <Loading size="large"
                                    status={!(rView.isLoaded())}
                                    style={menuCollapsed ? "left:initial;right:0;padding-right:0em;" : "left:initial;right:0;padding-right:17em;"} />
                            </div>
                            <ReaderMenu isCollapsed={menuCollapsed} onCollapse={setMenuCollapsed} />
                        </div>
                    </ViewContext.Provider>
                </NavContext.Provider>
            </>
        );
    } else {
        setTimeout(() => setLoadingTimer(loadingTimer + 1), 1000);
        return (
            <>
                <div id="mangareader">
                    <div class="mangaloading">
                        <div class="loadingtext">LOADING...</div>
                        <div class="loadingtimer">{loadingTimer}</div>
                    </div>
                </div>
            </>
        )
    }
}
