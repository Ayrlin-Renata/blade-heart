import { useState } from "preact/hooks";

import '@/css/mangareader/menu/panelswitcher.scss';


export default function ({ children }: any) {
    const [ curPanel, setCurPanel ] = useState("");
    if(!curPanel) {
        handleSwitch(children[0].props.id);
    }

    function handleSwitch(pid: string) {
        setCurPanel(pid);
    }

    return (
        <>
            <div class="panelswitcher">
                <div class="tabs">
                    {children.map((child: any) => (
                        <>
                            <button class={ curPanel === child.props.id? "selected" : ""}
                                onClick={ () => handleSwitch(child.props.id) }>
                                    {child.props.icon}
                            </button>
                        </>
                    ))}
                </div>
            </div>

            {children.find((child: any) => child.props.id == curPanel)}
        </>
    )
}