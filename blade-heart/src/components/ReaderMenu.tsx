import { useState, useContext } from 'preact/hooks';

import { content as listContent } from '../assets/json/contentlist.json';
import { content as metaContent } from '../assets/json/contentmeta.json';

import { MangaNavContext, MangaNavData, MangaChapter } from '../routes/MangaReader';
import ReaderMenuHeader from './ReaderMenuHeader';
import LabelMenuItem from './LabelMenuItem';
import AccountMenuItem from './AccountMenuItem';
import SelectMenuItem, { SelectOption } from './SelectMenuItem';
import MenuDivider from './MenuDivider';

export default function () {
    const mangaNav: MangaNavData = useContext(MangaNavContext);
    const [ collapsed, setCollapsed ] = useState("false");
    const collapsedBool: boolean = collapsed === "true";

    const mangaInfo = listContent.find((obj) => obj.title === mangaNav.title);
    const mangaMeta: any = metaContent[mangaNav.title as keyof typeof metaContent];
    if(!mangaInfo || !mangaMeta) {
        console.warn("manga info not found!");
        return (<div class="readermenu">{"manga info not found!"}</div>);
    }

    function updateChapter(opt: MangaChapter) {
        mangaNav.chapter = opt;
        mangaNav.setMangaNav(mangaNav);
    }

    function updateLanguage(opt: SelectOption) {
        mangaNav.language = opt.value;
        mangaNav.setMangaNav(mangaNav);
    }

    return (
        <>
            <div class="readermenu">
                <button class={ collapsedBool? "collapsebtn collapsed" : "collapsebtn" } onClick={() => setCollapsed((!collapsedBool).toString())}>{collapsedBool? '‹' : '›'}</button>
                <div class={ collapsedBool? "contentarea collapsed" : "contentarea" } >
                    <ReaderMenuHeader />
                    <AccountMenuItem />
                    <MenuDivider />
                    <LabelMenuItem id="mangatitle" 
                        content={ mangaNav.title } 
                        subContent={ mangaInfo.subtitle } />
                    <SelectMenuItem id={ mangaNav.title + "/mangalanguage" }  
                        label="Language" 
                        options={mangaInfo.languages.map((lang:string) => { return { label:lang, value:lang } })} 
                        onChange={ updateLanguage }/>
                    <SelectMenuItem id={ mangaNav.title + "/mangachapter" }  
                        label="Chapter" 
                        options={mangaMeta.chapters.map((chap:any) => { return { label:chap.authornumber + ": " + chap.name, value:chap.numeral} })} 
                        onChange={ updateChapter }/>
                </div>

            </div>
        </>
    )
}