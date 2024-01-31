
import '@/css/components/account.scss'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'preact/hooks';

import AccountFrame from '@/components/AccountFrame'
import AccountLogin from './AccountLogin';
import AccountSignout from './AccountSignout';

import SettingsIcon from '@mui/icons-material/Settings';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from 'react-router-dom';

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
    noButton?: boolean,
    buttonType?: 'settings' | 'edit',
    onAuthEvent?: (event: SimpleAuthEvent) => void,
}

export default function ({ onAuthEvent, noButton, buttonType }: AccountComponent) {
    const [signedUser, setSignedUser] = useState(null as SimpleUser | null);
    buttonType = 'settings' //override for now, functionality not planned anymore

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

    const [expand, setExpand] = useState(false)

    function handleHoverActive(_event: any): void {
        if (!expand) {
            setExpand(true)
        }
    }

    function handleHoverInactive(_event: any): void {
        if (expand) {
            setExpand(false)
        }
    }

    const navigate = useNavigate()

    return (
        <>
            <div class="accountarea">
                <div class="activearea" onMouseOver={handleHoverActive} onMouseOut={handleHoverInactive}>
                    {noButton ? (<></>) : (
                        <div class={"iconarea" + (expand ? " expand" : "")}>
                            { buttonType === 'settings' ? 
                                (
                                    <button onClick={() => navigate('/account')}><SettingsIcon /></button>
                                ): buttonType === 'edit' ? (
                                    <button onClick={() => alert('somehow you\'ve found unplanned functionality')}><AddPhotoAlternateIcon /></button>
                                ): (<></>)
                            }
                        </div>
                    )}
                    <AccountFrame src={signedUser?.photoURL} />
                </div>
                <div class="account">
                    <div class="accName">{signedUser?.displayName || 'Account'}</div>
                    {signedUser ? <AccountSignout /> : <AccountLogin />}
                </div>
            </div>
        </>
    )
}