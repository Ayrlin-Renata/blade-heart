import { useState } from 'preact/hooks';
import { useLoaderData } from 'react-router-dom';

import { IdData } from '../../home/Root';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function () {
    const [accountName, setAccountName] = useState("");

    //const idData = useLoaderData() as { idData: IdData };
    // if (!idData.idData.account.name) {
    //     console.warn("no account!");
    // } else {
    //     setAccountName(idData.idData.account.name);
    // }

    return (
        <>
            <div class="bh-account menuitem" style={accountName ? "" : "display: none;"}>
                <AccountCircleIcon />
                <div class="accName">{accountName}</div>
            </div>
        </>
    )
}