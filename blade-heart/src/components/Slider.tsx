import { useState, useEffect } from 'preact/hooks';

import defaults from '../assets/json/defaults.json';

interface SliderProps {
    id: string;
    callback?: Function;
    lefttext?: string;
    righttext?: string;
}

export default function Slider({ id, callback, lefttext, righttext }: SliderProps) {
    const lsprefix = "sliders/";
    const [active, setActive] = useState((localStorage.getItem(lsprefix + id)
        || defaults.slider[id as keyof typeof defaults.slider]));
    const activeBool: boolean = active === "true";

    function toggleActive() {
        setActive((curActive) => {
            return (curActive !== "true").toString();
        });
    }

    useEffect(() => {
        localStorage.setItem(lsprefix + id, active.toString());
        if (callback) callback(active === "true");
    }, [active]);

    return (
        <>
            <div class="bh-slider-left" style={activeBool ? "color: #aaa;" : ""}>{lefttext}</div>
            <button id={id} class="bh-slider" onClick={() => toggleActive()}>
                <div class="bar" style={activeBool ? "margin-left: 2em;" : ""}></div>
            </button>
            <div class="bh-slider-right" style={!activeBool ? "color: #aaa;" : ""}>{righttext}</div>
        </>
    )
}