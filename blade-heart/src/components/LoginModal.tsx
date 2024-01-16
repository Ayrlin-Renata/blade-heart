import '@/css/components/loginmodal.scss'
import InfoIcon from '@mui/icons-material/Info';
import GoogleIcon from '@mui/icons-material/Google';
import WarningIcon from '@mui/icons-material/Warning';

import { loginPopup } from '@/utils/firebase';
import IconText from './IconText';
import MultiIcon from './MultiIcon';
import BladeHeartIcon from './BladeHeartIcon';
import { getAuth } from 'firebase/auth';

interface LoginModal {
    onExit: (uid?:string) => void
}

export default function ({ onExit }: LoginModal) {
    async function handleLoginClick() {
        const { err } = await loginPopup()
        if(err.error == true) {
            console.warn(err)
        }
        onExit()
    }

    function handleClickAway(): void {
        onExit(getAuth().currentUser?.uid);
    }

    return (
        <>
            <div class="loginmodal">
                <div class="modalbg" onClick={handleClickAway}></div>
                <div class="modalcard">
                    <div class="info">
                        <BladeHeartIcon />
                        <h1>Welcome to Blade Heart!</h1>
                        <IconText icon={<InfoIcon />}>Signing in allows Blade Heart to retain your preferences between visits.</IconText>
                        <IconText icon={
                            <MultiIcon
                                primary={<WarningIcon />}
                                left={<GoogleIcon />}
                            />
                        }>
                            Clicking the button below will pop-up another window listing your Google accounts.
                        </IconText>
                    </div>
                    <button class="loginpopup"
                        onClick={handleLoginClick}>Login with Google</button>
                </div>
            </div>
        </>
    )
}