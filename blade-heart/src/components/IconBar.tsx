import '@/css/components/iconbar.scss'
import { useNavigate } from 'react-router-dom'

interface IconBar {
    className?: string,
    items: {
        label: string,
        nav?: string,
        link?: string,
        icon: any
    }[]
}

export default function ({ className, items }: IconBar) {

    const navigate = useNavigate()

    const itemList = items.map((it) => {
        return (
            <>
                <div class="iconbaricon"
                    onClick={(it.nav ? () => navigate(it.nav || "") 
                        : (it.link? () => window.location.href = it.link || "#"
                        : () => {}))}>
                    {it.icon}
                    <div>{it.label}</div>
                </div>
            </>
        )
    })

    return (
        <>
            <div class={"iconbar " + (className ? className : "")}>
                { itemList }
            </div>
        </>
    )
}