import { useState } from 'preact/hooks';

import ReaderMenuHeader from './ReaderMenuHeader';
import AccountMenuItem from './AccountMenuItem';
import SelectMenuItem from './SelectMenuItem';
import MenuDivider from './MenuDivider';

export default function () {
    const [ collapsed, setCollapsed ] = useState("false");

    const collapsedBool: boolean = collapsed === "true";

    return (
        <>
            <div class="readermenu">
                <button class={ collapsedBool? "collapsebtn collapsed" : "collapsebtn" } onClick={() => setCollapsed((!collapsedBool).toString())}>{collapsedBool? '‹' : '›'}</button>
                <div class={ collapsedBool? "contentarea collapsed" : "contentarea" } >
                    <ReaderMenuHeader />
                    <AccountMenuItem />
                    <MenuDivider />
                    <SelectMenuItem id="mangalanguage" label="language" options={["EN","CN","JP"]} />
                </div>

            </div>
        </>
    )
}