import Account from '@/components/Account';
import AccountLogin from '@/components/AccountLogin';
import BladeHeartIcon from '@/components/BladeHeartIcon';

import '@/css/home/PageHeader.scss'

export default function PageHeader({ text }: { text: string }) {
    return (
        <div class="pageheader">
            <div class="maintitle">
                <BladeHeartIcon />
                <div class="titlewords bh-wordmark">
                    <h1>BLADE</h1>
                    <h1>HEART</h1>
                </div>
            </div>
            <p>{text}</p>
            <div class="accountarea">
                <Account />
                <AccountLogin />
            </div>
        </div>
    )
}