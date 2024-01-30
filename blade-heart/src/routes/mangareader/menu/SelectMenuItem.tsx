import Select, { SingleValue } from 'react-select';

import '@/css/mangareader/menu/selectmenuitem.scss';
import { useQueryClient } from '@tanstack/react-query';
import { usePrefComponent } from '@/utils/prefcomponent';
import { MutableRef, useRef } from 'preact/hooks';


export interface SelectOption {
    label: string,
    value: string
}

interface SelectMenuItem {
    id: string,
    label: string,
    options: SelectOption[],
    onChange?: (value: SelectOption) => void,
    set?: SelectOption,
    defaultValue?: SelectOption,
    disabled?: boolean,
}

export default function ({ id, label, options, onChange, set, defaultValue, disabled }: SelectMenuItem) {
    // default value
    if (defaultValue == undefined) defaultValue = options[0]

    // styles
    const selectStyles = {
        control: (baseStyles: any) => ({
            ...baseStyles,
            borderRadius: "5px",
            borderColor: '#00a0a0',
            background: "#000000",
            flexWrap: "nowrap",
            ":hover": { borderColor: "#ffffff" },
            transition: "border-color 0.25s ease-in-out",
        }),
        singleValue: (baseStyles: any) => ({
            ...baseStyles,
            color: disabled? "#707070" : "#ffffff",
        }),
        menu: (baseStyles: any) => ({
            ...baseStyles,
            background: "#000000",
            border: "solid 2px #005050"
        }),
        option: (baseStyles: any, state: { isFocused: any; }) => ({
            ...baseStyles,
            background: state.isFocused ? '#005050' : '#000000',
        }),
    }
    
    const upValue: MutableRef<any> = useRef()

    const oCh = (_source: any) => {
        if(onChange) onChange(upValue.current)
    }

    const { accType, status, updatePCState } = usePrefComponent(id, useQueryClient(), defaultValue, oCh)
    if (accType === 'auth' && status !== 'success') {
        return (
            <>
                <div class="selectmenuitem menuitem disabled">
                    <div>{label}</div>
                    <Select className="select"
                    options={options}
                    styles={ selectStyles }
                    defaultValue={defaultValue}
                    isDisabled={true}
                    value={set}
                />
                    {/* <div class='menuitemloading'>Loading...</div> */}
                </div>
            </>
        )
    } else if (accType === 'guest') {

    }

    //console.log('rerender', history, id)

    function handleChange(newValue: SingleValue<SelectOption>) {
        upValue.current = newValue
        const opt = newValue as SelectOption
        updatePCState('state', opt)
    }

    if (set) {
        updatePCState('force', set)
    }

    return (
        <>
            <div class={"selectmenuitem menuitem" + (disabled? " disabled": "")}>
                <div>{label}</div>
                <Select className="select"
                    options={options}
                    styles={selectStyles}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    //@ts-ignore
                    maxMenuHeight={"50vh"}
                    onMenuOpen={
                        () => {
                            setTimeout(() => {
                                const selectedEl: any = document.querySelector('[aria-selected="true"]');
                                if (selectedEl) {
                                    //selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                                    selectedEl.parentElement?.scrollTo({
                                        top: selectedEl.offsetTop,
                                        behavior: 'instant'
                                    })
                                }
                            }, 20);
                        }
                    }
                    isDisabled={disabled}
                    value={set}
                />
            </div>
        </>
    )
}