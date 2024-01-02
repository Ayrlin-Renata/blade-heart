import { getIdData } from '../routes/Root';
import { useLocation } from 'react-router-dom';


import ReaderPlayBar from '../components/ReaderPlayBar';
import ReaderPageArea from '../components/ReaderPageArea';
import ReaderNoteBar from '../components/ReaderNoteBar';
import ReaderMenu from '../components/ReaderMenu';

import '../css/mangareader.scss'

export async function loader() {
    const idData = await getIdData();
    return { idData }
}

export default function MangaReader() {
    const location = useLocation();

    return (
        <>
            <div id="mangareader">
                <div class="mainscreen">
                    <ReaderPlayBar  />
                    <ReaderPageArea location={ location } />
                    <ReaderNoteBar  />
                </div>
                <ReaderMenu />
            </div>
        </>
    );
}