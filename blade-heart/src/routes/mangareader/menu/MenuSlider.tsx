
import '@/css/components/slider.scss'
import { useQueryClient } from '@tanstack/react-query';
import { usePrefComponent } from '@/utils/prefcomponent';

interface SliderProps {
    id: string,
    onChange?: (state: boolean) => void,
    offText?: string,
    onText?: string,
    defaultValue?: boolean,
}

export default function Slider({ id, onChange, offText, onText, defaultValue }: SliderProps) {
    if (defaultValue == undefined) defaultValue = false

    const { accType, status, pcState, updatePCState } = usePrefComponent(id, useQueryClient(), defaultValue)
    if (accType === 'auth' && status !== 'success') {
        return (
            <>
                <div class="sliderwrapper disabled">
                    <div class={"bh-slider-left " + ((pcState.value) ? "active" : "")}>{offText}</div>
                    <button id={id} class={"bh-slider " + ((pcState.value) ? "active" : "")}
                        onClick={toggleActive}>
                        <div class="bar"></div>
                    </button>
                    <div class={"bh-slider-right " + ((pcState.value) ? "active" : "")}>{onText}</div>
                </div>
            </>
        )
    } else if (accType === 'guest') {

    }

    function toggleActive() {
        updatePCState('state', !(pcState.value));
        if (onChange) onChange(!(pcState.value));
    }

    return (
        <>
            <div class="sliderwrapper">
                <div class={"bh-slider-left " + ((pcState.value) ? "active" : "")}>{offText}</div>
                <button id={id} class={"bh-slider " + ((pcState.value) ? "active" : "")}
                    onClick={toggleActive}>
                    <div class="bar"></div>
                </button>
                <div class={"bh-slider-right " + ((pcState.value) ? "active" : "")}>{onText}</div>
            </div>
        </>
    )
}