import { useDispatch } from 'react-redux';
import Slider from '../../../components/Slider';
import { readermenu } from './menuPref'

import '@/css/mangareader/menu/slidermenuitem.scss';


interface SliderMenuItem {
    id: string
    label: string
    offText?: string
    onText?: string
    onChange?: (state: boolean) => void
}

export default function ({ id, label, offText, onText, onChange }: SliderMenuItem) {
    const dispatch = useDispatch();

    function handleChange(state: boolean) {
        dispatch(readermenu.actions.updateSlider({ id: id, state: state }))
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