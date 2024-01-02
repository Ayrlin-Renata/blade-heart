import { useState } from 'preact/hooks';
import { Resizable } from 're-resizable';

export default function ( { location } : { location:any } ) {
    const urlPage: string = (location.pathname.split('/').length > 0
            ? location.pathname.split('/')[location.pathname.split('/').length - 1]
            : 'default-word');
    const bhurl:string = urlPage + "/readerpagearea/width";

    const [ remWidth, setRemWidth ] = useState(localStorage.getItem(bhurl) || "50vw");

    const contentstyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #ddd",
        background: "#f0f0f0"
    } as const;

    const handlestyle = {
        height: "100vh",
        width: "15px",
        marginTop: "-1px",
        borderRadius: "2px",
        transition: "background-color 0.2s ease-in-out",
    } as const;

    function handleResizeStop(event: MouseEvent | TouchEvent, direction: string, refToElement: HTMLElement, delta: any) {
        localStorage.setItem(bhurl, refToElement.offsetWidth.toString() + "px");
    }

    return (
        <>
            <Resizable
                className="resizable re-readerpagearea"
                style={contentstyle}
                defaultSize={{
                    width: remWidth,
                    height: '100vh'
                }}
                minWidth={'200px'}
                maxWidth={'60vw'}
                minHeight={'200px'}
                maxHeight={'100vh'}
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                handleClasses={{ right: "righthandle" }}
                handleStyles={{ right: handlestyle }}
                onResizeStop={handleResizeStop}
            >
                <div class="readerpagearea">PAGE AREA</div>
            </Resizable>
        </>
    )
}