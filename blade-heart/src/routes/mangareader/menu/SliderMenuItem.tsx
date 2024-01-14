import Slider from '../../../components/Slider';

import '@/css/mangareader/menu/slidermenuitem.scss';


interface SliderMenuItem {
    id: string
    label: string
    offText?: string
    onText?: string
    onChange?: (state: boolean) => void
}

export default function ({ id, label, offText, onText, onChange }: SliderMenuItem) {

    function handleChange(state: boolean) {
        //
        if (onChange) onChange(state);
    }

    return (
        <>
            <div class="slidermenuitem menuitem">
                <div>{label}</div>
                <Slider id={id}
                    offText={offText}
                    onText={onText}
                    onChange={handleChange} />
            </div>
        </>
    )
}