import '@/css/components/sharebutton.scss'
import { createRef } from "preact";


interface ShareButton {
    id: string,
    icon: any,
    onClick?: (event?: MouseEvent) => void,
    onMouseOver?: (event?: MouseEvent) => void,
    onMouseOut?: (event?: MouseEvent) => void,
    toClipboardText?: string,
    toClipboardImageSrc?: { src: RequestInfo | URL, type: string }
    toClipboardCallback?: (success: boolean) => void,
    tab?: boolean,
}

export default function ({
    id,
    icon,
    onClick,
    onMouseOver,
    onMouseOut,
    toClipboardText,
    toClipboardImageSrc,
    toClipboardCallback,
    tab
}: ShareButton) {

    function handleClick(event: MouseEvent) {
        if (toClipboardText) shareToClipboardText();
        if (toClipboardImageSrc) shareToClipboardImg();
        if (onClick) onClick(event);
    }

    function handleMouseOver(event: MouseEvent) {
        if (onMouseOver) onMouseOver(event);
    }

    const buttonRef = createRef();
    function handleMouseOut(event: MouseEvent) {
        (buttonRef.current as HTMLButtonElement).classList.remove('active');
        if (onMouseOut) onMouseOut(event);
    }

    //@ts-ignore
    function handleMouse(event: MouseEvent, isDownEvent: boolean) {
        if (buttonRef.current) {
            if (isDownEvent)
                (buttonRef.current as HTMLButtonElement).classList.add('active');
            else
                (buttonRef.current as HTMLButtonElement).classList.remove('active');
        }
    }

    function shareToClipboardText() {
        navigator.clipboard.writeText(toClipboardText || "");
    }

    async function shareToClipboardImg() {
        if (!toClipboardImageSrc) return;
        var noerror = false;
        try {
            const img = await fetch(toClipboardImageSrc.src);
            const imgBlob = await img.blob();
            const type = toClipboardImageSrc.type;
            console.log(imgBlob)
            navigator.clipboard.write([
                new ClipboardItem({
                    [type]: imgBlob, // change image type accordingly
                })
            ]);
            noerror = true;
        } catch (error) {
            console.error(error);
        }
        if (toClipboardCallback) toClipboardCallback(noerror);
    }

    return (
        <>
            <button id={id}
                class="sharebutton"
                tabindex={ (tab == true)? NaN : -1 }
                onClick={(event) => handleClick(event)}
                onMouseOver={(event) => handleMouseOver(event)}
                onMouseOut={(event) => handleMouseOut(event)}
                onMouseDown={(event) => handleMouse(event, true)}
                onMouseUp={(event) => handleMouse(event, false)}
                ref={buttonRef}>
                {icon}
            </button>
        </>
    )
}