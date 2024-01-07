import { createContext } from 'preact';
import { useState } from 'preact/hooks';
// import Interact, { Interaction, Inertia } from 'interactjs';

import { getIdData } from '../routes/Root';
import { useLocation } from 'react-router-dom';

import ReaderPlayBar from '../components/ReaderPlayBar';
import ReaderPageArea from '../components/ReaderPageArea';
import ReaderNoteBar from '../components/ReaderNoteBar';
import ReaderMenu from '../components/ReaderMenu';

import '../css/mangareader.scss'

// MangaNav

export const MangaNavContext = createContext({
    readerLocation: null,
    title: "",
    language: "",
    chapter: { label: "", numeral: "", pageCount: NaN },
    setMangaNav: () => { }
} as MangaNavData);

export interface MangaNavData {
    readerLocation: Location | null,
    title: string,
    language: string,
    chapter: MangaChapter,
    setMangaNav: (mangaNav: MangaNavData) => void,
}

export interface MangaChapter {
    label: string,
    numeral: string,
    pageCount: number
}

function updateNavTitle(location: any) {
    const urlPage: string = (location.pathname.split('/').length > 0
        ? location.pathname.split('/')[location.pathname.split('/').length - 1]
        : 'default-word');
    return decodeURIComponent(urlPage);
}


// ReaderView

export const ReaderViewContext = createContext({
    height: 0,
    prevHeight: 0,
    scroll: 0,
    setReaderView: () => { },
} as ReaderViewData);

export interface ReaderViewData {
    height: number,
    prevHeight: number,
    scroll: number,
    setReaderView: (readerView: ReaderViewData) => void,
}


// MenuPref

export const MenuPrefContext = createContext({
    prefs: [],
    setMenuPref: () => { },
} as MenuPrefData);

export interface MenuPrefData {
    prefs: MenuPref[]
    setMenuPref: (menuPref: MenuPrefData) => void,
}

export interface MenuPref {
    id: string,
    value: any
}

export function replaceInMenuPref(mPref: MenuPrefData, pf: MenuPref) {
    const tpf = mPref.prefs.find((spf) => (spf.id == pf.id) );
    if(tpf) {
        tpf.value = pf.value;
    } else {
        mPref.prefs.push(pf);
    }
    //return mPref;
}


// react-router data 

export async function loader() {
    const idData = await getIdData();
    return { idData }
}

export default function MangaReader() {

    //Menu Collapsed State
    const [menuCollapsed, setMenuCollapsed] = useState("false");
    const menuCollapsedBool: boolean = menuCollapsed === "true";

    //MangaNav
    const location = useLocation();
    const [mangaNav, setMangaNav] = useState({
        readerLocation: location,
        title: updateNavTitle(location),
        language: "",
        chapter: { label: "", numeral: "", pageCount: NaN },
        setMangaNav: updateMangaNavContext
    });

    function updateMangaNavContext(mNav: MangaNavData) {
        mNav.title = updateNavTitle(mNav.readerLocation);
        setMangaNav({ ...mNav });
    }

    //ReaderView
    const [readerView, setReaderView] = useState({
        height: 0,
        prevHeight: 0,
        scroll: 0,
        setReaderView: updateReaderViewContext,
    });

    function updateReaderViewContext(rView: ReaderViewData) {
        setReaderView({ ...rView });
    }

    //MenuPref
    const [menuPref, setMenuPref] = useState({
        prefs: [] as MenuPref[],
        setMenuPref: updateMenuPrefContext,
    });

    function updateMenuPrefContext(mPref: MenuPrefData) {
        //console.log( "mPref", mPref.prefs[0]);
        setMenuPref({ ...mPref });
    }

    //console.log({...readerView});

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

    return (
        <>
            <div id="mangareader">
                <MenuPrefContext.Provider value={menuPref}>
                    <ReaderViewContext.Provider value={readerView}>
                        <MangaNavContext.Provider value={mangaNav}>
                            <div class="mainscreen">
                                {/* <div class="draggable" >TEST</div> */}
                                <div class="maininner">
                                    <ReaderPlayBar />
                                    <ReaderPageArea />
                                    <ReaderNoteBar />
                                    <div class={menuCollapsedBool ? "notespacer collapsed" : "notespacer"}></div>
                                </div>
                            </div>
                            <ReaderMenu isCollapsed={menuCollapsedBool} onCollapse={setMenuCollapsed} />
                        </MangaNavContext.Provider>
                    </ReaderViewContext.Provider>
                </MenuPrefContext.Provider>
            </div>
        </>
    );
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