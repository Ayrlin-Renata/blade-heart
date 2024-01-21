import '@/css/components/modal.scss'
import { ContainerNode, createRef, render } from 'preact';

interface Modal {
    children: any,
    altText?: string,
    fullview?: boolean,
    onExit?: (uid?: string) => void
}

const modalRef = createRef()
export default function ({ children, altText, fullview, onExit }: Modal) {

    function handleClickAway(): void {
        modalRef.current?.remove()
        if(onExit) onExit()
    }

    return (
        <>
            <div class={"modal"  + (fullview? " fullview": "")}>
                <div class="modalbg" onClick={handleClickAway}></div>
                <div class="modalinner">
                    <div class="modalcard">
                        { children }
                    </div>
                    <div class="modalalt">{altText}</div>
                </div>
            </div>
        </>
    )
}

export function openModal(modal:any) {
    
    modalRef.current = document.getElementById('app')?.appendChild(document.createElement('div'));
    render(
        modal,
        modalRef.current as ContainerNode
    )
}
