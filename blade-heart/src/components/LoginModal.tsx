import '@/css/components/loginmodal.scss'
import InfoIcon from '@mui/icons-material/Info';
import GoogleIcon from '@mui/icons-material/Google';
import WarningIcon from '@mui/icons-material/Warning';
import AddLinkIcon from '@mui/icons-material/AddLink';
import TwitterIcon from '@mui/icons-material/Twitter';
import XIcon from '@mui/icons-material/X';
import TuneIcon from '@mui/icons-material/Tune';

import { loginPopupGoogle, loginPopupTwitter } from '@/utils/firebase';
import IconText from './IconText';
import MultiIcon from './MultiIcon';
import BladeHeartIcon from './icons/BladeHeartIcon';
import { getAuth } from 'firebase/auth';

interface LoginModal {
    onExit: (uid?: string) => void
}

export default function ({ onExit }: LoginModal) {
    async function handleLoginClick(provider: 'google' | 'twitter') {
        let res;
        switch (provider) {
            case 'google': {
                res = await loginPopupGoogle()
            } break;
            case 'twitter': {
                res = await loginPopupTwitter()
            } break;
        }
        if (res.err.error == true) {
            console.warn(res.err)
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
                        <IconText icon={
                            <MultiIcon
                                primary={<TuneIcon />}
                                left={<InfoIcon />}
                            />
                        }>Signing in allows Blade Heart to retain your preferences between visits.</IconText>
                        <IconText icon={
                            <MultiIcon
                                primary={<AddLinkIcon />}
                                left={<WarningIcon />}
                            />
                        }>
                            If you already have an account, do NOT sign in with a different authentication provider! Link them from your existing account.
                        </IconText>
                        <IconText icon={
                            <MultiIcon
                                primary={<GoogleIcon />}
                                left={<WarningIcon />}
                            />
                        }>
                            Clicking 'Login with Google' below will pop-up another window listing your Google accounts.
                        </IconText>
                        <IconText icon={
                            <MultiIcon
                                primary={<XIcon />}
                                left={<WarningIcon />}
                            />
                        }>
                            Clicking 'Login with Xwitter' below will pop-up another window revealing your signed-in X/Twitter account.
                        </IconText>
                    </div>
                    <button class="loginpopup"
                        onClick={() => handleLoginClick('google')}><GoogleIcon />Login with Google</button>
                    <button class="loginpopup"
                        onClick={() => handleLoginClick('twitter')}>
                        <MultiIcon
                            primary={<TwitterIcon />}
                            left={<XIcon />}
                        />
                        Login with Xwitter</button>
                    <IconText icon={( //SVG reCAPTCHA icon 
                        <svg style="font-size: 2.5rem" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false">
                            <path style="fill:#ffffff" d="M8.998 12.034c-.888 0-2.25-1.692-2.25-3.154V7.034L9 6.096V4.472L5.25 6.034V8.88c0 2.032 1.818 4.653 3.748 4.653l.018-.002h-.018v-1.49z"></path>
                            <path style="fill:#007070" d="M12.75 6.034L9 4.472v1.624l2.25.938V8.88c0 1.462-1.36 3.154-2.25 3.154v1.497h.017c1.926-.01 3.733-2.62 3.733-4.65V6.04z"></path>
                            <path style="fill:#007070" d="M9.286 10.043a.806.806 0 0 1-1.14 0l-1.12-1.12.57-.568 1.12 1.12 3.203-3.2.57.57-3.21 3.198zm-6.116 2.67l1.357.27c-1.967-2.18-2.07-5.434-.298-7.708l.53.536.53-2.65-2.66.53.56.56a7.464 7.464 0 0 0-1.67 4.23c-.01.18-.03.36-.03.54 0 .1.01.2.01.29 0 .17.01.33.03.49.01.1.03.19.04.29a7.323 7.323 0 0 0 .15.76 7.326 7.326 0 0 0 .44 1.25l.1.23c.08.17.18.34.28.51.03.07.07.13.11.2.11.18.24.36.37.53.04.05.07.1.1.14.08.11.18.21.27.31l-.26-1.29z"></path>
                            <path style="fill:#ffffff" d="M15.403 5.81l-.532-2.654-.54.545a8.178 8.178 0 0 0-.23-.22l-.13-.13a7.49 7.49 0 0 0-4.19-1.82v.02a7.556 7.556 0 0 0-2.41.14l-.07.01a7.47 7.47 0 0 0-1.39.48 6.993 6.993 0 0 0-.69.37c-.07.05-.15.09-.23.14a6.2 6.2 0 0 0-.46.33c-.07.05-.14.1-.2.15-.1.09-.2.19-.31.28l1.29-.27-.25 1.26a6.037 6.037 0 0 1 8.23.34l-.53.53 2.66.53zm-.443 3.94a5.897 5.897 0 0 1-1.69 3.488c-2.162 2.158-5.563 2.317-7.93.495l.49-.49-2.66-.53.532 2.653.563-.562a7.507 7.507 0 0 0 5.397 1.67c.03-.004.06-.004.09-.007.2-.02.4-.05.597-.085.04-.01.09-.015.14-.024a9.44 9.44 0 0 0 .57-.14c.05-.016.1-.028.15-.044a7.25 7.25 0 0 0 1.25-.51c.04-.02.08-.044.12-.066a7.3 7.3 0 0 0 .54-.32c.03-.02.06-.044.09-.064a7.45 7.45 0 0 0 1.11-.91c.08-.08.15-.17.23-.253.1-.11.21-.23.31-.35l.18-.24c.11-.15.22-.3.32-.46.04-.06.07-.12.11-.19a7.27 7.27 0 0 0 .36-.69 7 7 0 0 0 .56-2.07l-1.46-.29z"></path>
                        </svg>)}>
                        This site is protected by a modern version of reCAPTCHA, which doesn't require a login challenge.
                    </IconText>
                </div>
            </div>
        </>
    )
}