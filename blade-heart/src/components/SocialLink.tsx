import '@/css/sociallink.scss'

export default function SocialLink({ children, site, handle, href } 
        : {children: any, site: string, handle: string, href: string}) {
    return (
        <>
            <div class="sociallink">
                { children }
                <div class="text">
                    <p class="site">{ site }</p>
                    <a href={ href }>{ handle }</a>
                </div>
            </div>
        </>
    )
}