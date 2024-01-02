import { Resizable } from 're-resizable';


export default function () {
    const contentstyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #ddd",
        background: "#050505"
    } as const;

    const handlestyle = {
        height: "100vh",
        width: "15px",
        marginTop: "-1px",
        borderRadius: "2px",
        transition: "background-color 0.2s ease-in-out",
    } as const;

    return (
        <>
            <Resizable
                className="resizable re-readerplaybar"
                style={contentstyle}
                defaultSize={{
                    width: '50px',
                    height: '100vh'
                }}
                minWidth={'10vw'}
                maxWidth={'30vw'}
                minHeight={'100vh'}
                maxHeight={'100vh'}
                enable={{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                handleClasses={{right:"righthandle"}}
                handleStyles={{right:handlestyle}}
            >
                <div class="readerplaybar">PLAY BAR</div>
            </Resizable>
        </>
    )
}