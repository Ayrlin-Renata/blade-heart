
import '@/css/mangareader/menu/buttonmenuitem.scss';


interface ButtonMenuItem {
    id: string
    label: string
    children: any
    onClick?: () => void
}

export default function ({ id, label, children: button, onClick }: ButtonMenuItem) {

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