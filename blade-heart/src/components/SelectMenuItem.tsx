import { useState } from 'preact/hooks';
import Select from 'react-select';

export interface SelectOption {
    label: string,
    value: string
}

interface SelectMenuItem {
    id: string
    label: string
    options: SelectOption[]
    onChange?: (value: SelectOption) => void
}

export default function ({ id, label, options, onChange }: SelectMenuItem) {
    const [selected, setSelected] = useState(() => {
        const def = (localStorage.getItem(id) || "");
        if (def) {
            if (onChange) {
                onChange(JSON.parse(def));
            }
        }
        return def;
    });

    function handleChange(opt: SelectOption) {
        const jOpt = JSON.stringify(opt);
        localStorage.setItem(id, jOpt);
        setSelected(jOpt);
        if (onChange) onChange(opt);
    }

    var defaultOption = null;
    if(selected) {
        defaultOption = JSON.parse(selected);
    } else {
        defaultOption = options[0];
        handleChange(defaultOption);
    }

    return (
        <>
            <div class="selectmenuitem menuitem">
                <div>{label}</div>
                <Select className="select"
                    options={options}
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
                    defaultValue={ defaultOption }
                    onChange={handleChange} />
            </div>
        </>
    )
}