import '@/css/account/accountpage.scss'
import '@/css/_code.scss'

import LabelMenuItem from "../mangareader/menu/LabelMenuItem"
import MenuHeader from '../mangareader/menu/MenuHeader'
import Account from '@/components/Account'
import PanelSwitcher from '../mangareader/menu/PanelSwitcher'
import SPanel from '../mangareader/menu/SPanel'

import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TwitterIcon from '@mui/icons-material/Twitter'
import CloudIcon from '@mui/icons-material/Cloud';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import XIcon from '@mui/icons-material/X';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GoogleIcon from '@mui/icons-material/Google';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';


import MenuDivider from '../mangareader/menu/MenuDivider'
import SocialLink from '@/components/SocialLink'
import BladeHeartIcon from '@/components/BladeHeartIcon'
import MultiIcon from '@/components/MultiIcon'
import { getAuth, onAuthStateChanged, GoogleAuthProvider, linkWithPopup, TwitterAuthProvider } from 'firebase/auth'
import { useEffect, useState } from 'preact/hooks'
import { providerList, useUserdata } from '@/utils/firebase'
import Highlight from 'react-highlight'
import InfoMenuItem from '../mangareader/menu/InfoMenuItem'
import ButtonMenuItem from '../mangareader/menu/ButtonMenuItem'




export default function () {
    const [_refresh, setRefresh] = useState(false)

    const auth = getAuth();
    const user = auth.currentUser;
    useEffect(() => {
        onAuthStateChanged(auth, () => {
            setRefresh((re) => !re)
        })
    }, [])

    const { data, status } = useUserdata()

    
    const ids = {
        landing: 'acc/pnl/land',
        account: 'acc/pnl/acc',
        data: 'acc/pnl/data',
    }


    var linkButtons;
    if (status === 'success') {
        const providers = providerList;
        const providerNames = {
            "google.com": "Google",
            "twitter.com": "Xwitter"
        }
        console.log(providerList, user?.providerId)
        linkButtons = providers
            //.filter((provider) => provider.providerId !== user?.providerId)
            .map((provider) => {
                const pName = providerNames[provider.providerId as keyof typeof providerNames]
                return (
                    <ButtonMenuItem id={ids.account + '/btn/link' + pName}
                        label={"Link Account: "}
                        onClick={() => handleClick(provider.providerId)}>
                        {"Link with " + pName}
                    </ButtonMenuItem>
                )}
            )
    }


    function handleClick(providerId: string): void {
        switch (providerId) {
            case "google.com": {
                const provider = new GoogleAuthProvider();
                const auth = getAuth();
                if (auth.currentUser)
                    linkWithPopup(auth.currentUser, provider).then((_result) => {
                        console.log("linked GOOGLE!!")
                        alert("Successfully linked with Google!")
                        // const credential = GoogleAuthProvider.credentialFromResult(result);
                        // const user = result.user;
                    }).catch((error) => {
                        console.warn("FAILED TO LINK GOOGLE", error)
                        alert("There was a problem linking your account!\n" + error)
                    });
            } break;
            case "twitter.com": {
                const provider = new TwitterAuthProvider();
                const auth = getAuth();
                if (auth.currentUser)
                    linkWithPopup(auth.currentUser, provider).then((_result) => {
                        console.log("linked TWITTER!!")
                        alert("Successfully linked with Xwitter!")
                        // const credential = TwitterAuthProvider.credentialFromResult(result);
                        // const user = result.user;
                    }).catch((error) => {
                        console.warn("FAILED TO LINK TWITTER", error)
                        alert("There was a problem linking your account!\n" + error)
                    });
            } break;
        }

    }

    return (
        <>

            <div class="accountpage">
                {/* <menu class="menubar">
                    <MenuHeader />
                    <LabelMenuItem id={'acc/lbl/title'} content="Account" subContent="blade-heart account settings menu" />
                </menu> */}
                <div class="header">
                    <MenuHeader />
                    <Account noButton />
                </div>
                <div class="contentbar">
                    {/* <button class="back" onClick={() => navigate(-1)}>{'‹‹‹ go back'}</button> */}

                    <div class="contentarea">
                        <PanelSwitcher>
                            <SPanel id={ids.landing}
                                icon={<><MonitorHeartIcon /><div>Landing</div></>}>
                                <LabelMenuItem key={ids.landing + '/lbl/title'}
                                    id={ids.landing + '/lbl/title'}
                                    content="Landing Page"
                                    subContent="saving account info from being leaked since 2024" />
                                <MenuDivider />
                                <h3 class="menuitem">
                                    <BladeHeartIcon />
                                    {'Reasons to make a Blade Heart account in ' + new Date().getFullYear().toString() + ':'}
                                </h3>
                                <ol class="menuitem">
                                    <li>literally just do it</li>
                                    <li>all your data is right over there on that menu</li>
                                    <li>don't see your fav login provider on the options? actually just @ me </li>
                                    <li>
                                        <div class="socials" style="display: flex; flex-direction: row; flex-wrap: wrap;">
                                            <SocialLink site="Xwitter" handle="@ayrlinrenata" href="https://twitter.com/ayrlinrenata">
                                                <MultiIcon
                                                    primary={<TwitterIcon />}
                                                    left={<XIcon />}
                                                />
                                            </SocialLink>
                                            <SocialLink site="BlueSky" handle="ayrlin.bsky.app" href="https://bsky.app/profile/ayrlin.bsky.social">
                                                <CloudIcon />
                                            </SocialLink>
                                            <SocialLink site="Discord" handle="ayrlin" href="#">
                                                <SportsEsportsIcon />
                                            </SocialLink>
                                        </div>
                                    </li>
                                    <li>^^^^^^ look i stole those for you right off the home page</li>
                                    <li>making guest accs work AT ALL was a pain</li>
                                    <li>i made this list style specifically just for this</li>
                                    <li>tbh i dont even know why i'm trying to be so convincing i literally don't get anything from people having accs</li>
                                    <li>mihoyo hire me</li>
                                </ol>
                            </SPanel>
                            <SPanel id={ids.account}
                                icon={<><ManageAccountsIcon /><div>Account</div></>}>
                                <LabelMenuItem key={ids.account + '/lbl/title'}
                                    id={ids.account + '/lbl/title'}
                                    content="Account Settings"
                                    subContent="blade-heart account settings menu" />
                                <MenuDivider />
                                {auth.currentUser ? (
                                    <>
                                        <h3 class="menuitem">
                                            <AssignmentIndIcon />
                                            Account Info
                                        </h3>
                                        <InfoMenuItem label="User ID: "
                                            spoiler>
                                            {user?.uid}
                                        </InfoMenuItem>
                                        <InfoMenuItem label="Email: "
                                            spoiler>
                                            {user?.email}
                                        </InfoMenuItem>
                                        <InfoMenuItem label="Email Verification: "
                                            style="margin-bottom:-0.3em"
                                            spoiler>
                                            {user?.emailVerified ? (<CheckBoxIcon />) : (<CheckBoxOutlineBlankIcon />)}
                                        </InfoMenuItem>
                                        <InfoMenuItem label="Profile Image Link: "
                                            style="overflow-wrap: anywhere;"
                                            spoiler>
                                            {user?.photoURL}
                                        </InfoMenuItem>
                                        <InfoMenuItem label="Login Providers: "
                                            spoiler>
                                            {user?.providerData.map((profile) => profile.providerId).toString()}
                                        </InfoMenuItem>

                                        <h3 class="menuitem">
                                            <PersonAddIcon />
                                            Link Accounts
                                        </h3>
                                        {linkButtons}
                                        <p class="menuitem"></p>
                                    </>
                                ) : (
                                    <h3 class="menuitem" style="justify-content:center;">
                                        <MultiIcon primary={<SettingsIcon />}
                                            left={<DoNotDisturbIcon />} />
                                        I have checked and this user has been deemed Not Logged In :3
                                    </h3>
                                )}
                            </SPanel>
                            <SPanel id={ids.data}
                                icon={<><BarChartIcon /><div>Data</div></>}>
                                <LabelMenuItem key={ids.data + '/lbl/title'}
                                    id={ids.data + '/lbl/title'}
                                    content="User Data"
                                    subContent="account data information" />
                                <MenuDivider />
                                {auth.currentUser ? (status === 'success' ? (
                                    <>
                                        <p class="menuitem">
                                            i heard something about a law in europe that requires sites to give users their data if they asked...
                                        </p>
                                        <p class="menuitem">
                                            but i just thought it was a good idea.
                                        </p>
                                        <h3 class="menuitem" style="justify-content:center;">
                                            <CloudDownloadIcon />
                                            Here's your data: All of it.
                                        </h3>
                                        <Highlight langauge="json">
                                            {JSON.stringify(data, null, 2)}
                                        </Highlight>
                                        <p class="menuitem">
                                            you can login with google or xwitter or whatever, but the way the API's work, they never really actually touch any of the stuff that actually goes to the database. at least on this site anyway. that's just not really how it works.
                                        </p>
                                        <h3 class="menuitem" style="justify-content:center;">
                                            <MultiIcon
                                                primary={<TwitterIcon />}
                                                left={<XIcon />}
                                            />
                                            <PrivacyTipIcon />
                                            <GoogleIcon />
                                        </h3>
                                        <p class="menuitem">
                                            this site does use Firebase tho, which uses Google Cloud Platform, so your data is on Google servers anyway. always happens one way or another tbh.
                                        </p>
                                        <p class="menuitem">
                                            none of it is "identifying information" tho, like it's literally a bunch of toggles and the chapter you're reading.
                                        </p>
                                        <p class="menuitem">
                                            anyway, uh, stay safe out there, if you're concerned about any of this you can @ me i guess.
                                        </p>
                                        <p class="menuitem"></p>
                                    </>
                                ) : (
                                    <>
                                        <h3 class="menuitem" style="justify-content:center;">
                                            <CloudOffIcon />
                                            data ain't work, pls refresh page oomfie
                                        </h3>
                                    </>
                                )) : (
                                    <h3 class="menuitem" style="justify-content:center;">
                                        <MultiIcon primary={<CloudOffIcon />}
                                            left={<PeopleIcon />} />
                                        I don't keep data on guest users. Create an account if you want some :3
                                    </h3>
                                )}
                            </SPanel>
                        </PanelSwitcher>
                    </div>
                </div>
            </div >
        </>
    )
}
