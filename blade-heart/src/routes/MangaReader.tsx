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

export const MangaNavContext = createContext({
    readerLocation: null,
    title: "",
    language: "",
    chapter: { label: "", value: "" },
    setMangaNav: () => { }
} as MangaNavData);

export interface MangaNavData {
    readerLocation: any,
    title: string,
    language: string,
    chapter: MangaChapter,
    setMangaNav: (mangaNav: MangaNavData) => void,
}

export interface MangaChapter {
    label: string,
    value: string
}

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

export async function loader() {
    const idData = await getIdData();
    return { idData }
}

export default function MangaReader() {
    const [ menuCollapsed, setMenuCollapsed ] = useState("false");
    const menuCollapsedBool: boolean = menuCollapsed === "true";

    const location = useLocation();
    const [mangaNav, setMangaNav] = useState({
        readerLocation: location,
        title: updateNavTitle(location),
        language: "",
        chapter: { label: "", value: "" },
        setMangaNav: updateMangaNavContext
    });

    function updateMangaNavContext(mNav: MangaNavData) {
        mNav.title = updateNavTitle(mNav.readerLocation);
        setMangaNav({ ...mNav });
    }

    const [readerView, setReaderView] = useState({
        height: 0,
        prevHeight: 0,
        scroll: 0,
        setReaderView: updateReaderViewContext,
    });

    function updateReaderViewContext(rView: ReaderViewData) {
        //console.log("updateReaderViewContext", {...rView});
        setReaderView({ ...rView });
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
                <ReaderViewContext.Provider value={readerView}>
                    <MangaNavContext.Provider value={mangaNav}>
                        <div class="mainscreen">
                            {/* <div class="draggable" >TEST</div> */}
                            <div class="maininner">
                                <ReaderPlayBar />
                                <ReaderPageArea />
                                <ReaderNoteBar />
                                <div class={ menuCollapsedBool? "notespacer collapsed" : "notespacer"}></div>
                            </div>
                        </div>
                        <ReaderMenu isCollapsed={ menuCollapsedBool } onCollapse={ setMenuCollapsed }/>
                    </MangaNavContext.Provider>
                </ReaderViewContext.Provider>
            </div>
        </>
    );
}

function updateNavTitle(location: any) {
    const urlPage: string = (location.pathname.split('/').length > 0
        ? location.pathname.split('/')[location.pathname.split('/').length - 1]
        : 'default-word');
    return decodeURIComponent(urlPage);
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