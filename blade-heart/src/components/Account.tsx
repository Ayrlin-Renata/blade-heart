
import '@/css/components/account.scss'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'preact/hooks';

import AccountFrame from '@/components/AccountFrame'
import AccountLogin from './AccountLogin';
import AccountSignout from './AccountSignout';

interface SimpleUser {
    uid: string,
    displayName: string | null,
    photoURL: string | null,
}

interface SimpleAuthEvent {
    type: 'login' | 'signout',
    user: SimpleUser | null
}

interface AccountComponent {
    onAuthEvent?: (event: SimpleAuthEvent) => void
}

export default function ({ onAuthEvent }: AccountComponent) {
    const [signedUser, setSignedUser] = useState(null as SimpleUser | null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log('SIGNED IN', user)
                // console.log('SU', signedUser)
                setSignedUser({ ...user })
                if (onAuthEvent) onAuthEvent({ type: 'login', user: signedUser })
            } else {
                // console.log('SIGNED OUT:', user)
                setSignedUser(null)
                if (onAuthEvent) onAuthEvent({ type: 'signout', user: signedUser })
            }
        });
    }, [])

    return (
        <>
            <div class="accountarea">
                <AccountFrame src={signedUser?.photoURL} />
                <div class="account">
                    <div class="accName">{signedUser?.displayName || 'Account'}</div>
                    {signedUser ? <AccountSignout /> : <AccountLogin />}
                </div>
            </div>
        </>
    )
}