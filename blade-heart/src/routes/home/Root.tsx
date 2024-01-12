import PageHeader from './PageHeader'
import ContentList from './ContentList'
import PageFooter from './PageFooter'



export interface IdData {
    account: ClientAccount
}
export interface ClientAccount {
    name: string
}

export function getIdData() {
    const nullAccount = { name: "Ayrlin Renata" } as ClientAccount;

    return {
        account: nullAccount
    } as IdData;
}

export default function Root() {
    return (
        <div class="fullpage">
            <PageHeader text={"a fan-project to make an improved supplemental media experience for Honkai Impact 3rd"}/>
            <ContentList />
            <PageFooter />
        </div>
    )
}