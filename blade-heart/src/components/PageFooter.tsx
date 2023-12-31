import SocialLink from './SocialLink'
import TwitterIcon from '@mui/icons-material/Twitter'
import CloudIcon from '@mui/icons-material/Cloud';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
export default function PageFooter() {
    return (
        <>
            <div class="bh-pagefooter">
                <p>a web app by Ayrlin Renata.</p>
                <div class="socials">
                    <SocialLink site="Xwitter" handle="@ayrlinrenata" href="https://twitter.com/ayrlinrenata">
                        <TwitterIcon />
                    </SocialLink>
                    <SocialLink site="BlueSky" handle="ayrlin.bsky.app" href="https://bsky.app/profile/ayrlin.bsky.social">
                        <CloudIcon />
                    </SocialLink>
                    <SocialLink site="Discord" handle="ayrlin" href="#">
                        <SportsEsportsIcon />
                    </SocialLink>
                </div>
                <p>Images on this site may bear resemblance to, or be official works depicting Hoyoverse / Cognosphere's copyrighted characters and IP, which belong to Hoyoverse / Cognosphere Ltd.</p>
            </div>
        </>
    )
}