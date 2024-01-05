import { useState, useEffect } from 'preact/hooks';

import defaults from '../assets/json/defaults.json';

interface SliderProps {
    id: string;
    onChange?: (state: boolean) => void;
    offText?: string;
    onText?: string;
}

export default function Slider({ id, onChange, offText: lefttext, onText: righttext }: SliderProps) {
    const lsprefix = "sliders/";
    const [active, setActive] = useState(() => initActiveState());
    const activeBool: boolean = active === "true";

    function initActiveState() {
        const startVal = localStorage.getItem(lsprefix + id) 
            || defaults.slider[id as keyof typeof defaults.slider] 
            || "false";
        //setActive(startVal);
        if (onChange) onChange(startVal === "true");
        return startVal;
    }

    function toggleActive() {
        setActive((curActive) => {
            return (curActive !== "true").toString();
        });
        if (onChange) onChange(active !== "true");
    }

    useEffect(() => {
        //console.log("slider:", lsprefix, id, active);
        localStorage.setItem(lsprefix + id, active.toString());
    }, [active]);

    return (
        <>
            <div class="sliderwrapper">
                <div class={"bh-slider-left " + (activeBool ? "active" : "")}>{lefttext}</div>
                <button id={id} class={"bh-slider " + (activeBool ? "active" : "")}
                    onClick={toggleActive}>
                    <div class="bar"></div>
                </button>
                <div class={"bh-slider-right " + (activeBool ? "active" : "")}>{righttext}</div>
            </div>
        </>
    )
}