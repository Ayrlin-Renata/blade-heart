import '@/css/components/highlightsection.scss'
import PageSection from './PageSection'

interface HighlightSection {
    className?: string,
    title: string,
    children: any,
}

export default function ({ className, children, title }: HighlightSection) {

    return (
        <>
            <PageSection className={"highlightsection " + (className ? className : "")}
                title={title}>
                <div class="display">
                    {children}
                </div>
            </PageSection>
        </>
    )
}