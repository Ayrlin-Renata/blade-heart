
import '@/css/components/accountlogin.scss'
import { useState } from 'preact/hooks'

import LoginModal from '@/components/LoginModal'
import { ContainerNode, render } from 'preact'

interface AccountLogin {
    text?: string
}

export default function ({ text }: AccountLogin) {
    const [modalOpen, setModalOpen] = useState(false)

    function handleClick(event: any): void {
        setModalOpen(true);

        const modal = document.getElementById('app')?.appendChild(document.createElement('div'));
        render(
            (<>
                <LoginModal onExit={() => {
                    setModalOpen(false)
                    modal?.remove()
                    }} />
            </>),
            modal as ContainerNode
        )


    }

    return (
        <>
            <button class="loginbtn"
                onClick={handleClick}>
                {text || "LOGIN"}
            </button>
        </>
    )
}