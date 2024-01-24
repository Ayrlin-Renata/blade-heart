import '@/css/components/pagesection.scss'

interface PageSection {
    className?: string,
    title: string,
    children: any,
}

export default function ({ className, children, title }: PageSection) {

    return (
        <>
            <div class={"pagesection " + (className ? className : "")}>
                <div class="title">{title}</div>
                {children}
            </div>
        </>
    )
}