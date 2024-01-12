

interface SPanel {
    id: string,
    icon: any,
    children: any,
}

export default function ( {children} : SPanel) {

    return (
        <div class="spanel">
            { children  } 
        </div>
    )
}