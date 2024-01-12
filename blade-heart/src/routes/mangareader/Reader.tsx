import { useState } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux'

import ReaderPlayBar from './ReaderPlayBar';
import ReaderPageArea from './ReaderPageArea';
import ReaderNoteBar from './notebar/ReaderNoteBar';
import ReaderMenu from './menu/ReaderMenu';

import '@/css/mangareader/mangareader.scss'
import { useLocation } from 'react-router-dom';
import { getIdsFromUrl as splitLocation } from '@/utils/urlutils';
import { nav, select } from './readerNav';

export default function MangaReader() {
    //States
    const [loadingTimer, setLoadingTimer] = useState(1)
    const [menuCollapsed, setMenuCollapsed] = useState(false)

    //Store
    const mNav = useSelector(select);

    const dispatch = useDispatch()

    const loc = useLocation()
    const lids = splitLocation(loc);
    if(lids.mangaid != mNav?.manga) dispatch(nav.actions.manga(lids.mangaid))
    if(lids.langid != mNav?.lang) dispatch(nav.actions.lang(lids.langid))
    if(lids.chapid != mNav?.chap) dispatch(nav.actions.chap(lids.chapid))

    
    //console.log(mNav)
    const isLoading: boolean = !mNav && loadingTimer > 0; 
    if (!isLoading) {
        return (
            <>
                <div id="mangareader">

                    <div class="mainscreen">
                        {/* <div class="draggable" >TEST</div> */}
                        <div class="maininner">
                            {/* <ReaderPlayBar /> */}
                            {/* <ReaderPageArea /> */}
                            {/* <ReaderNoteBar /> */}
                            <div class={menuCollapsed ? "notespacer collapsed" : "notespacer"}></div>
                        </div>
                    </div>
                    <ReaderMenu isCollapsed={menuCollapsed} onCollapse={setMenuCollapsed} />

                </div>
            </>
        );
    } else {
        setTimeout(() => setLoadingTimer(loadingTimer + 1),1000);
        return (
            <>
                <div id="mangareader">
                    <div class="mangaloading">LOADING... <div>{loadingTimer}</div></div>
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
