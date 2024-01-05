
interface SPanel {
    id: string,
    icon: any,
    children: any,
}

export default function ( {id, icon, children} : SPanel) {

    return (
        <>
            { children  } 
        </>
    )
}