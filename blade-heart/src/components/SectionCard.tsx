import '@/css/components/sectioncard.scss'
import { MutableRef, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'

interface SectionCard {
    className?: string,
    size: 'large' | 'medium' | 'small',
    link?: string,
    backgrounds: string[],
    children: any,
}

export default function ({ className, size, link, backgrounds, children }: SectionCard) {
    const [bgRot, setBgRot] = useState(-1)

    useEffect(() => {
        //console.log('test')
        setBgRot(0)
    },[])

    
    const tfRef: MutableRef<boolean> = useRef() as MutableRef<boolean>
    
    useEffect(() => {
        if(!tfRef.current) {
            tfRef.current = true;
            setTimeout(() => {
                setBgRot((prev) => {
                    //console.log(prev, backgrounds.length)
                    let nbg = prev + 1
                    if (nbg >= backgrounds.length)
                        nbg = 0
                    return nbg
                })
                tfRef.current = false;
            }, 6000)
        }
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


    const navigate = useNavigate()
    function handleClick(_event: any): void {
        if(link) {
            navigate(link)
        }
    }

    return (
        <>
            <div class={"sectioncard " + size + " " + (className ? className : "")}
                onClick={handleClick}>
                <div class="bg">
                    {bgRender}
                </div>
                {children}
            </div>
        </>
    )
}