import { useState } from 'preact/hooks';
import Select from 'react-select';

interface SelectMenuItem {
    id: string
    label: string
    options: Array<string>
}

export default function ({ id, label, options }: SelectMenuItem) {
    const prefix: string = 'selectmenuitem/';
    const [ selected, setSelected ] = useState(localStorage.getItem(prefix + id) || "");

    function handleChange(opt: { label: string, value: string }) {
        const jOpt = JSON.stringify(opt);
        localStorage.setItem(prefix + id, jOpt);
        setSelected(jOpt);
    }

    return (
        <>
            <div class="selectmenuitem menuitem">
                <div>{label}</div>
                <Select className="select"
                    options={
                        options.map((stringItem: string) => ({
                            value: stringItem.toLowerCase(),
                            label: stringItem.charAt(0).toUpperCase() + stringItem.slice(1)
                        }))}
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            borderRadius: "5px",
                            borderColor: '#00a0a0',
                            background: "#000000",
                            flexWrap: "nowrap",
                            ":hover": { borderColor: "#ffffff" },
                        }),
                        singleValue: (baseStyles) => ({
                            ...baseStyles,
                            color: "#ffffff",
                        }),
                        menu: (baseStyles) => ({
                            ...baseStyles,
                            background: "#000000",
                            border: "solid 2px #005050"
                        }),
                        option: (baseStyles, state) => ({
                            ...baseStyles,
                            background: state.isFocused ? '#005050' : '#000000',
                        }),
                    }}
                    defaultValue={selected? JSON.parse(selected) : { label: options[0], value: options[0] }} 
                    onChange={ handleChange } />
            </div>
        </>
    )
}