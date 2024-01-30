import '@/css/components/pagesection.scss'

interface PageSection {
    className?: string,
    title: string,
    subtitle?: string,
    children: any,
}

export default function ({ className, children, title, subtitle }: PageSection) {

    return (
        <>
            <div class={"pagesection " + (className ? className : "")}>
                <div class="title">{title}</div>
                {(subtitle ? (<div class="subtitle">{subtitle}</div>) : (<></>))}
                {children}
            </div>
        </>
    )
}