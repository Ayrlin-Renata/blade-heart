import { getIdData } from '../routes/Root';

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
    return (
        <>
            <div id="mangareader">
                <div class="mainscreen">
                    <ReaderPlayBar />
                    <ReaderPageArea />
                    <ReaderNoteBar />
                </div>
                <ReaderMenu />
            </div>
        </>
    );
}