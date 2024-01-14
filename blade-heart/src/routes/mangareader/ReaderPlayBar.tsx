import { useContext, useState } from 'preact/hooks';
import { Resizable } from 're-resizable';
import { NavContext } from './Reader';


export default function () {
    // const readerView: ReaderViewData = useContext(ReaderViewContext);
    const mNav = useContext(NavContext)

    const bhurl: string = mNav.mangaid + "/readerplaybar/width";
    const [remWidth] = useState(localStorage.getItem(bhurl) || "50px");

    const contentstyle = {
        display: "flex",
        justifyContent: "center",
        background: "#000000"
    } as const;

    const handlestyle = {
        height: "100%",
        width: "15px",
        marginTop: "-1px",
        borderRadius: "2px",
        transition: "background-color 0.2s ease-in-out",
    } as const;

    // @ts-ignore: need params for definition
    function handleResizeStop(event: MouseEvent | TouchEvent, direction: string, refToElement: HTMLElement, delta: any) {
        localStorage.setItem(bhurl, refToElement.offsetWidth.toString() + "px");
    }

    return (
        <>
            <Resizable
                className="resizable re-readerplaybar"
                style={contentstyle}
                defaultSize={{
                    width: remWidth,
                    height: 'fit-content'
                }}
                minWidth={'64px'}
                maxWidth={'20vw'}
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                handleClasses={{ right: "righthandle" }}
                handleStyles={{ right: handlestyle }}
                onResizeStop={handleResizeStop}
            >
                <div class="readerplaybar" >
                    <div>PLAY BAR</div>
                </div>
            </Resizable>
        </>
    )
}