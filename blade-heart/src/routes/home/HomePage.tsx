import '@/css/home/homepage.scss'

import { createRef } from 'preact'

import IconBar from '@/components/IconBar'
import PageSection from '@/components/PageSection'
import HighlightSection from '@/components/HighlightSection'
import ListSection from '@/components/ListSection'
import SectionCard from '@/components/SectionCard'
import SocialLink from '@/components/SocialLink'
import MultiIcon from '@/components/MultiIcon'

import BladeHeartSword from '@/components/icons/BladeHeartSword'
import DiscordIcon from '@/components/icons/DiscordIcon'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import XIcon from '@mui/icons-material/X'
import TwitterIcon from '@mui/icons-material/Twitter'
import CloudIcon from '@mui/icons-material/Cloud'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import HandymanIcon from '@mui/icons-material/Handyman';

import { content as sitemeta } from '@/assets/json/sitemeta.json'
import MenuHeader from '../mangareader/menu/MenuHeader'
import LabelMenuItem from '../mangareader/menu/LabelMenuItem'
import PageMenu from '@/components/PageMenu'
import AccountMenuItem from '../mangareader/menu/AccountMenuItem'
import AccountFrame from '@/components/AccountFrame'
import MenuDivider from '../mangareader/menu/MenuDivider'
import ButtonMenuItem from '../mangareader/menu/ButtonMenuItem'
import { useNavigate } from 'react-router-dom'
import PanelSwitcher from '../mangareader/menu/PanelSwitcher'
import SPanel from '../mangareader/menu/SPanel'
import SliderMenuItem from '../mangareader/menu/SliderMenuItem'



export default function () {

    const mangaList = Object.entries(sitemeta.lore.manhua).map(([key, data]) => {
        return {
            key: key,
            data: data,
            backgrounds: data.covers,
            value: (
                <>
                    <div class="fg">
                        <div class="type">{data.type}</div>
                        <div class="title">{data.title}</div>
                        <div class="subtitle">{data.subtitle}</div>
                        <div class="desc">{data.desc}</div>
                    </div>
                </>
            )
        }
    })

    const highlightRender = sitemeta.highlight.map((path) => {
        const mangaPath = path.id.split('|')[1]
        const manga = mangaList.find((ele) => ele.key === mangaPath)
        if (!manga) {
            console.warn('unable to find manga', mangaPath);
            return (<></>)
        }
        //console.log(mangaPath, mangaList)
        return (
            <SectionCard className="mangacard"
                size="large"
                link={manga.data.link}
                backgrounds={manga.backgrounds}>
                {manga.value}
            </SectionCard>
        )
    })


    const mangaRender = mangaList.map((ele) => {
        return (
            <SectionCard className="mangacard"
                size="medium"
                link={ele.data.link}
                backgrounds={ele.backgrounds}>
                {ele.value}
            </SectionCard>
        )
    })


    const ids = {
        manga: "home|manga",
        tools: "home|tools",
        settings: "home|acct",
    }

    const mangaMenuRender = mangaList.map((ele) => {
        return (
            <ButtonMenuItem id={ids.manga + '/btn/' + ele.key}
                label={ele.data.title}
                onClick={() => { navigate(ele.data.link) }}>
                <ExitToAppIcon />
            </ButtonMenuItem>
        )
    })

    const scrollRef = createRef()
    const lsRef = createRef()
    const navigate = useNavigate()

    return (
        <>
            <div class="homescreen" ref={scrollRef}>
                <div class="landingshade" ref={lsRef}
                    onClick={() => {
                        (scrollRef.current as HTMLElement).scrollTo({
                            top: lsRef.current?.offsetHeight,
                            behavior: "smooth"
                        })
                    }}>
                    <div class="bgoverlay">
                        <img src="/src/assets/graphics/bh-cover.png"></img>
                    </div>
                    <div class="logocard">
                        <BladeHeartSword />
                        <div class="titlewords bh-wordmark">
                            <h1>BLADE</h1>
                            <h1>HEART</h1>
                        </div>
                        <HeartBrokenIcon />
                    </div>
                    <div class="logosubtitle">The Tenets of Blade Heart are cited in four parts.</div>
                    <KeyboardArrowUpIcon />
                </div>
                <PageMenu>
                    <MenuHeader />
                    <AccountMenuItem />
                    <MenuDivider />
                    <LabelMenuItem id={'home|lbl|title'}
                        content="Menu"
                        subContent="blade-heart homepage menu" />
                    <PanelSwitcher>
                        <SPanel key={ids.tools}
                            id={ids.tools}
                            icon={<><HandymanIcon /><div>Tools</div></>}>
                            <LabelMenuItem id={ids.tools + '|lbl|title'}
                                content="Tools"
                                subContent="blade-heart tools list" />
                        </SPanel>
                        <SPanel key={ids.manga}
                            id={ids.manga}
                            icon={<><MenuBookIcon /><div>Manga</div></>}>
                            <LabelMenuItem id={ids.manga + '|lbl|title'}
                                content="Manga"
                                subContent="blade-heart manga list" />
                            {mangaMenuRender}
                        </SPanel>
                        <SPanel key={ids.settings}
                            id={ids.settings}
                            icon={<><SettingsIcon /><div>Settings</div></>}>
                            <LabelMenuItem id={ids.settings + '|lbl|title'}
                                content="Settings"
                                subContent="blade-heart settings menu" />
                            <ButtonMenuItem id={ids.settings + '|btn|acct'}
                                label="Account Settings"
                                onClick={() => { navigate('/blade-heart/account/') }}>
                                <ExitToAppIcon />
                            </ButtonMenuItem>
                            <SliderMenuItem id={ids.settings + '|sld|music'}
                                key={ids.settings + '|sld|music'}
                                label="Homepage Music"
                                onText='on'
                                offText='off'
                                defaultValue={true}
                            />
                        </SPanel>
                    </PanelSwitcher>
                </PageMenu>
                <div id="features" class="featurepage">
                    <div class="featbg">
                        <img class="bg-end" src="/src/assets/graphics/bh-bg-end.png"></img>
                        <img class="bg" src="/src/assets/graphics/bh-bg.png"></img>
                    </div>
                    <PageSection className="infosection"
                        title="Still as water,"
                        subtitle="free from dust...">
                        <div class='row bg'>
                            <div class="">
                                <AccountFrame src="/src/assets/graphics/ayrlin.png" />
                            </div>
                            <div class="infotext">
                                <div class="text">hi, i'm ayrlin! </div>
                                <div class="text">i came up with the idea to make an improved manga reader since i love the mangas and wanted it to be easier to share. </div>
                                <div class="text">as the project grew in scope though, i realized this had the potential to be something bigger- not just a manga reader but also a way to foster discussion and encourage the creation of lore resources and supplemental experiences.</div>
                                <div class="text">i really wanted to try to raise the bar for honkai 3rd EN fan sites, and make something to give back to the honkai impact 3rd community, and well, this is the start!</div>
                                {/* <div class="text">welcome, captain :3 i hope you like it here.</div> */}
                                <br />
                                <div class="text">if you do like what you see, feel free to login and join in on events! the discord is also here for ya :3</div>
                            </div>
                            {/* <BladeHeartIcon /> */}
                        </div>
                    </PageSection>
                    <IconBar className="socialsbar"
                        items={
                            [{
                                label: "Discord",
                                icon: <MultiIcon
                                    primary={<DiscordIcon />}
                                    left={<></>}
                                />
                            }, {
                                label: "Xwitter",
                                icon: <MultiIcon
                                    primary={<TwitterIcon />}
                                    left={<XIcon />}
                                />
                            }]
                        } />
                    <HighlightSection className="highlightbar"
                        title="Featured Projects">
                        {highlightRender}
                    </HighlightSection>
                    <ListSection className="lorebar"
                        title="Lore Projects">
                        {mangaRender}
                        <SectionCard size="medium"
                            backgrounds={[]}>
                            <div class="fg">
                                <div class="subtitle">Coming Soon...</div>
                            </div>
                        </SectionCard>
                    </ListSection>
                    <ListSection className="toolsbar"
                        title="Tools">
                        <SectionCard size="medium"
                            backgrounds={[]}>
                            <div class="fg">
                                <div class="subtitle">Coming Soon...</div>
                            </div>
                        </SectionCard>
                        <SectionCard size="medium"
                            backgrounds={[]}>
                            <div class="fg">
                                <div class="subtitle">Coming Soon...</div>
                            </div>
                        </SectionCard>
                    </ListSection>

                    <PageSection className="faqsection"
                        title="Frequently Asked Questions"
                        subtitle="actually noone asked, i made it up">
                        <div class='row'>
                            <ol class="bg infotext pagelist">
                                <li><strong>Why aren't all the manga volumes here?</strong></li>
                                <div class="text">as this site features collaborative contribution as a feature, i want to focus attention on one release at a time with release events. <br/> plus, i have to complete the json definitons for each of the supported sources before they display properly.</div>
                                <hr/>
                                <li><strong>This website is actually a broken mess.</strong></li>
                                <div class="text">PLEASE tell me!!! literally just @ me on discord or socials. i want this site to be <i>actually</i> good to use, so i need user feedback on what's bad.</div>
                            </ol>
                            {/* <BladeHeartIcon /> */}
                        </div>
                    </PageSection>
                    <PageSection className="devsection"
                        title="BLADE HEART">
                        <div class="text">a web app by Ayrlin Renata.</div>
                        <div class="socials">
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
                                <DiscordIcon />
                            </SocialLink>
                        </div>
                        <div class="text">if you somehow stumbled onto this site and think i am doing a good, you can support me by yelling at me on social media occationally, which makes me feel appreciated and needed. :3 </div>
                        <div class="text" style="font-size: small; color: #007070; max-width: 100%;">Images on this site may bear resemblance to, or be official works depicting Hoyoverse / Cognosphere's copyrighted characters, images, comics, and IP, which belong to Hoyoverse / Cognosphere Ltd.</div>

                    </PageSection>
                </div>
            </div>
        </>
    )
} 