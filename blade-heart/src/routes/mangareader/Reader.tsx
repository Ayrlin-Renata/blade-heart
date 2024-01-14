import { useMemo, useState } from 'preact/hooks';

import ReaderPlayBar from './ReaderPlayBar';
import ReaderPageArea from './ReaderPageArea';
import ReaderNoteBar from './notebar/ReaderNoteBar';
import ReaderMenu from './menu/ReaderMenu';

import '@/css/mangareader/mangareader.scss'
import { useLocation } from 'react-router-dom';
import { getIdsFromUrl as splitLocation } from '@/utils/urlutils';
import { createContext, createRef } from 'preact';
import { Size2, loadPageMeta as loadPageMeta } from '@/utils/jsonutils';

export const NavContext = createContext({} as MangaNav)

export interface MangaNav {
    mangaid: string,
    langid: string,
    chapid: string,
}

export const ViewContext = createContext({} as ReaderView)

export interface ReaderView {
    viewWidth: number,
    pages: ReaderPage[],
    heightUpTo: (rv: ReaderView, pageidx?: number) => number,
    posToPx: (rv: ReaderView, pos: number) => number,
    scrollTo: (unit: 'px' | 'pos', value: number) => void,
    isLoaded: () => boolean,
    update: (rv: ReaderView) => void,
}

export interface ReaderPage {
    numeral: number,
    src: string,
    origSize: Size2,
    viewHeight: number, //width from ReaderView
    suggestZoom?: boolean, //for multi-page layouts and oddly-dimensioned pages
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

    const scrollRef = createRef()
    const [rView, setRView] = useState({
        viewWidth: 0,
        pages: loadPageMeta(mNav),
        heightUpTo: heightUpTo,
        posToPx: posToPx,
        scrollTo: scrollTo,
        isLoaded: isRViewLoaded,
        update: updateRV,
    })

    if (lastLocation && !(JSON.stringify(lastLocation) == JSON.stringify(mNav))) {
        //console.log('tes',rView)
        rView.pages = loadPageMeta(mNav)
        rView.update(rView)
    }
    lastLocation = mNav

    function scrollTo(unit: 'px' | 'pos', value: number): void {
        if (scrollRef.current) {
            const htRef = scrollRef.current as HTMLElement
            var pix: number;
            if (unit === 'px') {
                pix = value
            } else {
                pix = posToPx(rView, value)
            }
            htRef.scrollTo({
                top: pix,
                behavior: 'smooth',
            })
        }
    }

    function heightUpTo(rv: ReaderView, pageidx?: number): number {
        if (pageidx == 0) return 0
        if (!pageidx) pageidx = rv.pages.length + 1

        let heightCount: number = 0
        //console.log('HUT',{...rView})
        for (let idx = 0; idx < pageidx; idx++) {
            //console.log('hut',rView.pages[idx].viewHeight, heightCount, idx)
            if (!rv.pages[idx]) return NaN
            heightCount += rv.pages[idx].viewHeight + 3 //readerpagearea.scss .pagecontainer gap
        }

        return heightCount
    }

    function posToPx(rv: ReaderView, pos: number): number {
        //console.log({...rView})
        const pageidx = Math.floor(pos / 100)
        const pageHeight = rv.pages[pageidx].viewHeight
        const pagePos = Number(pos.toString().padStart(2, '0').slice(-2))
        return heightUpTo(rv, pageidx) + ((pageHeight / 100) * pagePos)
    }

    function isRViewLoaded() {
        //console.log('comp',{...rView})
        //const widthLoaded = (rView.viewWidth > 0)
        const pagesLoaded = rView.pages.every((page) => page.loaded === true)
        //console.log(widthLoaded, pagesLoaded)
        return pagesLoaded
    }

    function updateRV(rv: ReaderView) {
        //console.log("COMP", rView, rv)
        setRView({ ...rv })
    }

    // function updateRViewParam(paramid: string, value: any) {
    //     const rv = {...rView}
    //     const params = paramid.split('/')
    //     const param = params.slice(0,-1)
    //     const last: any = params.slice(-1)

    //     let lastObj: any = rv
    //     for(const a of param) {
    //         if(lastObj && Object.keys(lastObj).includes(a)) {
    //             lastObj = lastObj[a as keyof typeof lastObj]
    //         }
    //     }

    //     if(typeof(value) == typeof(lastObj[last as keyof typeof lastObj])) {
    //         lastObj[last as keyof typeof lastObj] = value
    //     }
    //     console.log(params, rv)
    //     setRView(rv)
    // }
    //console.log("RENDER",rView)
    //console.log(mNav)
    const isLoading: boolean = ((!mNav || !(mNav.chapid)) && loadingTimer > 0);
    if (!isLoading) {
        return (
            <>
                <NavContext.Provider value={mNav}>
                    <ViewContext.Provider value={rView}>
                        <div id="mangareader">
                            <div class="mainscreen" ref={scrollRef}>
                                {/* <div class="draggable" >TEST</div> */}
                                <div class="maininner">
                                    <ReaderPlayBar />
                                    <ReaderPageArea />
                                    <ReaderNoteBar />
                                    <div class={menuCollapsed ? "notespacer collapsed" : "notespacer"}></div>
                                </div>
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

// function dragMoveListener(event:any) {
//     var target = event.target
//     // keep the dragged position in the data-x/data-y attributes
//     var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

//     // translate the element
//     target.style.transform = 'translate(' + 0 + 'px, ' + y + 'px)'

//     // update the posiion attributes
//     //target.setAttribute('data-x', x)
//     target.setAttribute('data-y', y)
// }

// Interact('.draggable').draggable({
//     inertia: true,
//     modifiers: [
//         Interact.modifiers.restrict({
//             restriction: {
//                 right: 0,
//                 left: 0,
//                 top: 400,
//                 bottom: 600,
//             },
//         })
//     ],
//     listeners: {
//         // call this function on every dragmove event
//         move: dragMoveListener,

//         // call this function on every dragend event
//         end(event) {

//         }
//     }
// });
