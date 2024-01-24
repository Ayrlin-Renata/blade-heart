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

import { content as sitemeta } from '@/assets/json/sitemeta.json'
import BladeHeartIcon from '@/components/icons/BladeHeartIcon'


export default function () {

    const mangaList = Object.entries(sitemeta.lore.manhua).map(([key, data]) => {
        return {
            key: key,
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
            <SectionCard className="mangacard" size="large"
                backgrounds={manga.backgrounds}>
                {manga.value}
            </SectionCard>
        )
    })


    const mangaRender = mangaList.map((ele) => {
        return (
            <SectionCard className="mangacard" size="medium"
                backgrounds={ele.backgrounds}>
                {ele.value}
            </SectionCard>
        )
    })

    const scrollRef = createRef()
    const lsRef = createRef()

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
                    <div class="logocard">
                        <BladeHeartSword />
                        <div class="titlewords bh-wordmark">
                            <h1>BLADE</h1>
                            <h1>HEART</h1>
                        </div>
                        <HeartBrokenIcon />
                    </div>
                    <div class="logosubtitle">crafted with care,<br />for the Honkai Impact 3rd community.</div>
                    <KeyboardArrowUpIcon />
                </div>
                <div id="features" class="featurepage">
                    <div>sticky menubar, login, shortcuts, audio</div>
                    <IconBar className="quickbar"
                        items={
                            [{
                                label: "ER RESKIN",
                                icon: <div>ICON</div>
                            }]
                        } />
                    <PageSection className="infosection"
                        title="Welcome, Captain!">
                        <BladeHeartIcon />
                        <div class="text">i came up with the idea to make an improved manga reader since i love the mangas and wanted it to be easier to share. as the project grew in scope though, i realized this had the potential to be something bigger- not just a manga reader but also a way to foster discussion and encourage the creation of lore resources and supplemental experiences by making them easy to access. i really wanted to try to raise the bar for honkai 3rd EN fan sites, and make something to give back to the honkai impact 3rd community, and well, this is the start! welcome, captain :3 i hope you like it here.</div>
                        <br/>
                        <div class="text">if you do like what you see, feel free to login and join in on events! the discord is also here for ya :3</div>
                    </PageSection>
                    <IconBar className="socialsbar"
                        items={
                            [{
                                label: "DISCORD",
                                icon: <DiscordIcon />
                            }, {
                                label: "XWITTER",
                                icon: <MultiIcon
                                    primary={<TwitterIcon />}
                                    left={<XIcon />}
                                />
                            }, {
                                label: "TEST",
                                icon: <TwitterIcon />
                            }
                            ]
                        } />
                    <HighlightSection className="highlightbar"
                        title="Highlighted">
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
                    <PageSection className="devsection"
                        title="Developer">
                        <div class="">DEV SECTION</div>
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
                    </PageSection>
                </div>
            </div>
        </>
    )
} 