import '@/css/components/accountframe.scss'

import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface AccountFrame {
    src: string | undefined | null
}

export default function ({ src }: AccountFrame) {

    if(src?.startsWith('https://pbs.twimg')) {//twitter
        src = src.replace(/_normal\.(\w+)$/, (_match, p1) => '.' + p1)
    }

    return (
        <>
            <div class="accountframe">
                {
                    (src) ? (<img src={src || undefined}></img>) : (<AccountBoxIcon />)
                }
            </div>
        </>
    )
} 