import '@/css/components/accountframe.scss'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';


interface AccountFrame {
    src: string | undefined | null
}

export default function ({ src }: AccountFrame) {

    return (
        <>
            <div class="accountframe">
                {
                    (src) ? (<img src={src || undefined}></img>) : (<AccountCircleIcon />)
                }
            </div>
        </>
    )
} 