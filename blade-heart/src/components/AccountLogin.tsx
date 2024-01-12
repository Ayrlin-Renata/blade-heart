
import '@/css/components/accountlogin.scss'
import { useState } from 'preact/hooks'

import LoginModal from '@/components/LoginModal' 

interface AccountLogin {
    text?: string
}

export default function ({ text }: AccountLogin) {
    const [modalOpen, setModalOpen] = useState(false)

    function handleClick(event: any): void {
        setModalOpen(true);
    }

    return (
        <>
            <button class="loginbtn"
                onClick={handleClick}>
                { text || "LOGIN"}
            </button>
            { modalOpen? (
                <>
                    <LoginModal onExit={ () => setModalOpen(false) }/>
                </>
            ) : ""}
        </>
    )
}