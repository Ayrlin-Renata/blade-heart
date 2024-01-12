
import '@/css/mangareader/menu/buttonmenuitem.scss';


interface ButtonMenuItem {
    id: string
    label: string
    button: string | HTMLElement
    onClick?: () => void
}

export default function ({ id, label, button, onClick }: ButtonMenuItem) {

    function handleClick() {
        if(onClick) onClick();
    }

    return (
        <>
            <div class="buttonmenuitem menuitem">
                <div>{label}</div>
                <button id={id}
                    onClick={ handleClick }>
                    { button }
                </button>
            </div>
        </>
    )
}