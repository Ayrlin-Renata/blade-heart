
import '@/css/components/accountlogin.scss'
import { getAuth } from 'firebase/auth';

interface AccountSignout {
    text?: string
}

export default function ({ text }: AccountSignout) {
    function handleClick(event: any): void {
        const auth = getAuth();
        auth.signOut();
    }

    return (
        <>
            <button class="signoutbtn"
                onClick={handleClick}>
                { text || "LOG OUT"}
            </button>
        </>
    )
}