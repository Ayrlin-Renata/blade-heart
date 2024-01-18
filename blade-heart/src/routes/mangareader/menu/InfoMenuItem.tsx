import { useState } from "preact/hooks";

import '@/css/mangareader/menu/infomenuitem.scss';


interface InfoMenuItem {
    label: string,
    style?: string,
    children: any,
    spoiler?: boolean,
}

export default function ({ label, children, spoiler, style }: InfoMenuItem) {
    const [hidden, setHidden] = useState(spoiler);

    function handleClick(_event: any): void {
        setHidden(false)
    }

    return (
        <>
            <div class="infomenuitem menuitem">
                <div class="infolabel">{label}</div>
                {hidden ? (
                    <>
                        <div class="infovalue" >
                            <button onClick={handleClick}>Reveal</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div class="infovalue" style={style}>{children}</div>
                    </>
                )}
            </div>
        </>
    )
}