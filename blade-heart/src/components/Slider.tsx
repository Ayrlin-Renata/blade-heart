import { useState } from 'preact/hooks';

import '@/css/components/slider.scss'

interface SliderProps {
    id: string,
    onChange?: (state: boolean) => void,
    offText?: string,
    onText?: string,
    defaultValue?: boolean,
}

export default function Slider({ id, onChange, offText, onText, defaultValue }: SliderProps) {
    const [active, setActive] = useState(defaultValue);

    function toggleActive() {
        setActive((active) => {
            return (!active)
        });
        if (onChange) onChange(!active);
    }

    return (
        <>
            <div class="sliderwrapper">
                <div class={"bh-slider-left " + (active ? "active" : "")}>{offText}</div>
                <button id={id} class={"bh-slider " + (active ? "active" : "")}
                    onClick={toggleActive}>
                    <div class="bar"></div>
                </button>
                <div class={"bh-slider-right " + (active ? "active" : "")}>{onText}</div>
            </div>
        </>
    )
}