import PageHeader from '../components/PageHeader'
import ContentList from '../components/ContentList'
import PageFooter from '../components/PageFooter'

export default function Root() {
    return (
        <div class="fullpage">
            <PageHeader />
            <ContentList />
            <PageFooter />
        </div>
    )
}