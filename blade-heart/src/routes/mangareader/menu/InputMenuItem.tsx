import { createRef } from "preact";
import { useState } from "preact/hooks";

import '@/css/mangareader/menu/inputmenuitem.scss';


interface InputMenuItem {
    id: string,
    value?: string,
    autoClear?: boolean,
    label: string,
    onEnter: (value: string) => void
}

export default function ({ id, label, value, autoClear, onEnter }: InputMenuItem) {
    const [_curValue, setCurValue] = useState(() => {
        const def = (value? value : localStorage.getItem(id) || "");
        if (def) {
            if (onEnter) {
                onEnter(JSON.parse(def));
            }
        }
        return def;
    });

    const dictInputRef = createRef();

    function handleKeyDown(event: any) {
        if (event.key === "Enter") {
            const jVal = JSON.stringify(dictInputRef.current.value);
            localStorage.setItem(id, jVal);
            setCurValue(jVal);
            onEnter(dictInputRef.current.value);
            if(autoClear) dictInputRef.current.value = "";
        }
    }

    return (
        <>
            <div class="inputmenuitem menuitem">
                <div>{label}</div>
                <input ref={dictInputRef} onKeyDown={handleKeyDown}></input>
            </div>
        </>
    )
}