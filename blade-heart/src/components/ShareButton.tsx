

interface ShareButton {
    id: string,
    icon: any,
    onClick: (event?: MouseEvent) => void
}

export default function( { id, icon, onClick }: ShareButton) {

    return (
        <>
            <button id={id} class="sharebutton" onClick={(event) => onClick(event)}>
                {icon}
            </button>
        </>
    )
}