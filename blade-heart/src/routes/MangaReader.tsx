import { createContext } from 'preact';
import { useState } from 'preact/hooks';

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
    chapter: { label:"", value:""}, 
    setMangaNav: () => {}
} as MangaNavData);

export interface MangaNavData {
    readerLocation: any,
    title: string,
    language: string,
    chapter: MangaChapter,
    setMangaNav: ( mangaNav: MangaNavData ) => void,
} 

export interface MangaChapter {
    label: string,
    value: string
}

export const ReaderViewContext = createContext({
    height: 0,
    prevHeight: 0,
    scroll: 0,
    setReaderView: () => {},
} as ReaderViewData);

export interface ReaderViewData {
    height: number,
    prevHeight: number,
    scroll: number,
    setReaderView: ( readerView: ReaderViewData ) => void,
}

export async function loader() {
    const idData = await getIdData();
    return { idData }
}

export default function MangaReader() {
    const location = useLocation();
    const [ mangaNav, setMangaNav ] = useState({
        readerLocation: location,
        title: updateNavTitle(location),
        language: "",
        chapter: { label:"", value:""},
        setMangaNav: updateMangaNavContext
    });

    function updateMangaNavContext(mNav: MangaNavData) {
        mNav.title = updateNavTitle(mNav.readerLocation);
        setMangaNav({...mNav});
    }
    
    const [ readerView, setReaderView ] = useState({
        height: 0,
        prevHeight: 0,
        scroll: 0,
        setReaderView: updateReaderViewContext,
    });

    function updateReaderViewContext(rView: ReaderViewData) {
        //console.log("updateReaderViewContext", {...rView});
        const oldH = rView.prevHeight;
        const newH = rView.height;
        if(newH != oldH) {
            //console.log("N/H", newH, oldH)
            const ratio = (newH)/(oldH);
            //const readMarker = window.innerHeight/2;
            // rView.scroll = (rView.scroll + readMarker)*ratio-readMarker;
            rView.scroll = (rView.scroll)*ratio;
            //console.log("ratio", ratio)
            rView.prevHeight = rView.height;
        }
        setReaderView({...rView});
    }

    //console.log({...readerView});

    return (
        <>
            <div id="mangareader">
                <ReaderViewContext.Provider value={ readerView }>
                <MangaNavContext.Provider value={ mangaNav }>
                    <div class="mainscreen">
                        <ReaderPlayBar />
                        <ReaderPageArea />
                        <ReaderNoteBar  />
                    </div>
                    <ReaderMenu />
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
