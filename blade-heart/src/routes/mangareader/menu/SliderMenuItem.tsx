
import '@/css/mangareader/menu/slidermenuitem.scss';
import MenuSlider from './MenuSlider';


interface SliderMenuItem {
    id: string
    label: string
    offText?: string
    onText?: string
    defaultValue?: boolean
    onChange?: (state: boolean) => void,
    disabled?: boolean,
}

export default function ({ id, label, offText, onText, defaultValue, onChange, disabled }: SliderMenuItem) {
    function handleChange(state: boolean) {
        if (onChange) onChange(state);
    }

    return (
        <>
            <div class={"slidermenuitem menuitem" + (disabled? " disabled": "")} >
                <div>{label}</div>
                <MenuSlider id={id}
                    offText={offText}
                    onText={onText}
                    onChange={handleChange}
                    defaultValue={defaultValue} />
            </div>
        </>
    )
}