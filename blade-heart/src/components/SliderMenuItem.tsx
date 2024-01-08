import { useContext } from 'preact/hooks';
import { MenuPrefData, MenuPrefContext, replaceInMenuPref } from '../routes/ChapterReader';
import Slider from './Slider';


interface SliderMenuItem {
    id: string
    label: string
    offText?: string
    onText?: string
    onChange?: (state: boolean) => void
}

export default function ({ id, label, offText, onText, onChange }: SliderMenuItem) {
    const menuPref: MenuPrefData = useContext(MenuPrefContext);

    function handleChange(state: boolean) {
        replaceInMenuPref(menuPref, {id: id, value: state});
        //console.log("afterrepl", {...menuPref.prefs}, state);
        menuPref.setMenuPref(menuPref);
        if(onChange) onChange(state);
    }

    return (
        <>
            <div class="slidermenuitem menuitem">
                <div>{label}</div>
                <Slider id={id}
                    offText={offText}
                    onText={onText}
                    onChange={ handleChange }/>
            </div>
        </>
    )
}