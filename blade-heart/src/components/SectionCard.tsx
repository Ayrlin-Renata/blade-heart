import '@/css/components/sectioncard.scss'
import { useEffect, useMemo, useState } from 'preact/hooks'

interface SectionCard {
    className?: string,
    size: 'large' | 'medium' | 'small',
    backgrounds: string[],
    children: any,
}

export default function ({ className, size, backgrounds, children }: SectionCard) {
    const [bgRot, setBgRot] = useState(0)

    useEffect(() => {
        const tid = setTimeout(() => {
            setBgRot((prev) => {
                //console.log(prev, backgrounds.length)
                let nbg = prev + 1
                if (nbg >= backgrounds.length)
                    nbg = 0
                return nbg
            })
        }, 5000)
    }, [bgRot])

    const bgRender = useMemo(() => {
        return backgrounds.map((cv, idx) => {
            return (
                <div class={"coverwrapper " + (bgRot == idx ? "active"
                    : bgRot == idx + 1 ? ""
                        : idx == backgrounds.length -1 && bgRot == 0? "" : "inactive")}>
                    <img class="cover" src={cv} />
                </div>
            )
        })
    }, [backgrounds, bgRot])

    return (
        <>
            <div class={"sectioncard " + size + " " + (className ? className : "")}>
                <div class="bg">
                    {bgRender}
                </div>
                {children}
            </div>
        </>
    )
}