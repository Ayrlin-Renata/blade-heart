
import '@/css/mangareader/menu/labelmenuitem.scss';

interface LabelMenuItem {
    id: string
    content: string
    subContent?: string
}

export default function ({ id, content, subContent }: LabelMenuItem) {
    return (
        <>
            <div class="menuitem labelmenuitem" id={id}>
                <div class="content"> {content} </div>
                <div class="subcontent"> {subContent} </div>
            </div>
        </>
    )
}