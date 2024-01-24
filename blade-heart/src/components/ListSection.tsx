import '@/css/components/listsection.scss'
import PageSection from './PageSection'

interface ListSection {
    className?: string,
    title: string,
    children: any,
}

export default function ({ className, children, title }: ListSection) {

    return (
        <>
            <PageSection className={"listsection " + (className ? className : "")}
                        title={title}>
                <div class="display">
                    {children}
                </div>
            </PageSection>
        </>
    )
}