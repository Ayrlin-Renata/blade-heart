import { useState } from 'preact/hooks';

import { content as listContent } from '../assets/json/contentlist.json';
import { content as metaContent } from '../assets/json/contentmeta.json';

import ReaderMenuHeader from './ReaderMenuHeader';
import LabelMenuItem from './LabelMenuItem';
import AccountMenuItem from './AccountMenuItem';
import SelectMenuItem from './SelectMenuItem';
import MenuDivider from './MenuDivider';

export default function ( { location } : { location: any} ) {
    const urlPage: string = (location.pathname.split('/').length > 0
    ? location.pathname.split('/')[location.pathname.split('/').length - 1]
    : 'default-word');
    const mangaTitle = decodeURIComponent(urlPage);
    const mangaInfo = listContent.find((obj) => obj.title === mangaTitle);
    const mangaMeta: any = metaContent[urlPage as keyof typeof metaContent];
    if(!mangaInfo || !mangaMeta) {
        console.warn("manga info not found!");
        return (<div class="readermenu">{"manga info not found!"}</div>);
    }
    
    const [ collapsed, setCollapsed ] = useState("false");

    const collapsedBool: boolean = collapsed === "true";

    return (
        <>
            <div class="readermenu">
                <button class={ collapsedBool? "collapsebtn collapsed" : "collapsebtn" } onClick={() => setCollapsed((!collapsedBool).toString())}>{collapsedBool? '‹' : '›'}</button>
                <div class={ collapsedBool? "contentarea collapsed" : "contentarea" } >
                    <ReaderMenuHeader />
                    <AccountMenuItem />
                    <MenuDivider />
                    <LabelMenuItem id="mangatitle" 
                        content={ mangaTitle } 
                        subContent={ mangaInfo.subtitle } />
                    <SelectMenuItem id={ mangaTitle + "/mangalanguage" }  
                        label="Language" 
                        options={mangaInfo.languages} />
                    <SelectMenuItem id={ mangaTitle + "/mangachapter" }  
                        label="Chapter" 
                        options={mangaMeta.chapters.map((obj:any) => obj.authornumber + ": " + obj.name)} />
                </div>

            </div>
        </>
    )
}