import SocialLink from '../../components/SocialLink'
import TwitterIcon from '@mui/icons-material/Twitter'
import CloudIcon from '@mui/icons-material/Cloud';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import '@/css/home/PageFooter.scss'

export default function PageFooter() {
    return (
        <>
            <div class="bh-pagefooter">
                <p>a web app by Ayrlin Renata. </p>
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
                <p>if you somehow stumbled onto this site and think i am doing a good, you can support me by yelling at me on social media occationally, which makes me feel appreciated and needed. :3 </p>
                <p>Images on this site may bear resemblance to, or be official works depicting Hoyoverse / Cognosphere's copyrighted characters, images, comics, and IP, which belong to Hoyoverse / Cognosphere Ltd.</p>
            </div>
        </>
    )
}