import BladeHeartIcon from '../../components/BladeHeartIcon';

import '@/css/home/PageHeader.scss'

export default function PageHeader() {
    return (
        <div class="bh-pageheader">
            <div class="maintitle">
                <BladeHeartIcon/>
                <div class="titlewords bh-wordmark">
                    <h1>BLADE</h1>
                    <h1>HEART</h1>
                </div>
            </div>
            <p>a fan-project to make an improved supplemental media experience for Honkai Impact 3rd</p>
        </div>
    )
}