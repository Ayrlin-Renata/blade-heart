import { useState } from 'preact/hooks'

interface SliderProps {
    id: string;
    op1?: string;
    op2?: string;
}

export default function Slider({ id, op1, op2 }: SliderProps) {
    const [ active, setActive ] = useState(false);

    function toggle() {
        setActive(!active);
    }

    return (
        <>
            <div class="bh-slider-left" style={ active? "color: #aaa;" : "" }>{ op1 }</div>
            <button id={ id } class="bh-slider" onClick={ () => toggle() }>
                <div class="bar" style={ active? "margin-left: 2em;" : "" }></div>
            </button>
            <div class="bh-slider-right" style={ !active? "color: #aaa;" : "" }>{ op2 }</div>
        </>
    )
}