import { useContext } from 'preact/hooks';

import { content as listContent } from '../assets/json/contentlist.json';
import { content as metaContent } from '../assets/json/contentmeta.json';

import {
    MangaChapter, 
    MangaNavContext, MangaNavData,
} from '../routes/MangaReader';
import ReaderMenuHeader from './ReaderMenuHeader';
import LabelMenuItem from './LabelMenuItem';
import AccountMenuItem from './AccountMenuItem';
import SelectMenuItem, { SelectOption } from './SelectMenuItem';
import MenuDivider from './MenuDivider';
import PanelSwitcher from './PanelSwitcher.tsx';
import SPanel from './SPanel.tsx';

import ChatIcon from '@mui/icons-material/Chat';
import SignpostIcon from '@mui/icons-material/Signpost';
import SettingsIcon from '@mui/icons-material/Settings';
import SliderMenuItem from './SliderMenuItem.tsx';
import ButtonMenuItem from './ButtonMenuItem.tsx';

interface ReaderMenu {
    isCollapsed: boolean,
    onCollapse: Function,
}

export default function ({ isCollapsed, onCollapse }: ReaderMenu) {
    const mangaNav: MangaNavData = useContext(MangaNavContext);

    const mangaInfo = listContent.find((obj) => obj.title === mangaNav.title);
    const mangaMeta: any = metaContent[mangaNav.title as keyof typeof metaContent];
    if (!mangaInfo || !mangaMeta) {
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


    const ids = {
        language: (mangaNav.title + "/mangalanguage"),
        chapter: (mangaNav.title + "/mangachapter"),
        notes: (mangaNav.title + "/panel/notes"),
        behaviours: (mangaNav.title + "/panel/behaviours"),
        settings: (mangaNav.title + "/panel/settings"),
    };
    const behaviourPresets = ["custom", "recommended"];

    return (
        <>
            <div class="readermenu">
                <button class={isCollapsed ? "collapsebtn collapsed" : "collapsebtn"} onClick={() => onCollapse((!isCollapsed).toString())}>{isCollapsed ? '‹' : '›'}</button>
                <div class={isCollapsed ? "contentarea collapsed" : "contentarea"} >
                    <ReaderMenuHeader />
                    {mangaNav && (<>
                        <AccountMenuItem />
                        <MenuDivider />
                        <LabelMenuItem id="mangatitle"
                            content={mangaNav.title}
                            subContent={mangaInfo.subtitle} />
                        <SelectMenuItem id={ids.language}
                            label="Language"
                            options={mangaInfo.languages.map((lang: string) => {
                                return { label: lang, value: lang }
                            })}
                            onChange={updateLanguage} />
                        <SelectMenuItem id={ids.chapter}
                            label="Chapter"
                            options={mangaMeta.chapters.map((chap: any) => {
                                return { label: chap.authornumber + ": " + chap.name, value: chap.numeral }
                            })}
                            onChange={updateChapter} />
                        <PanelSwitcher>
                            <SPanel id={ids.notes}
                                icon={<ChatIcon />}>
                                <LabelMenuItem id={ids.notes + "/label/title"}
                                    content="notes"
                                    subContent="preferences panel" />
                                <SliderMenuItem id={ids.notes + "/slider/category/language"}
                                    offText="hide"
                                    onText="show"
                                    label="Language" />
                                <SliderMenuItem id={ids.notes + "/slider/category/translation"}
                                    offText="hide"
                                    onText="show"
                                    label="Translation" />
                                <SliderMenuItem id={ids.notes + "/slider/category/pronunciation"}
                                    offText="hide"
                                    onText="show"
                                    label="Pronunciation" />
                                <SliderMenuItem id={ids.notes + "/slider/category/context"}
                                    offText="hide"
                                    onText="show"
                                    label="Context" />
                                <SliderMenuItem id={ids.notes + "/slider/category/extra"}
                                    offText="hide"
                                    onText="show"
                                    label="Extras" />
                            </SPanel>
                            <SPanel id={ids.behaviours}
                                icon={<SignpostIcon />}>
                                <LabelMenuItem id={ids.behaviours + "/label/title"}
                                    content="behaviours"
                                    subContent="preferences panel" />
                                <SelectMenuItem id={ids.behaviours + "/select/test"}
                                    label="Presets"
                                    options={behaviourPresets.map((pres: string) => { return { label: pres, value: pres } })} />
                            </SPanel>
                            <SPanel id={ids.settings}
                                icon={<SettingsIcon />}>
                                <LabelMenuItem id={ids.settings + "/label/title"}
                                    content="settings"
                                    subContent="preferences panel" />
                                <ButtonMenuItem id={ids.settings + "/slider/console/localStorageList"}
                                    label="[DEV] localStorage"
                                    button="LIST"
                                    onClick={function test() { 
                                        console.log(Array
                                            .from({ length: localStorage.length}, (_,i) => i)
                                            .map((jndex) => ({ key: localStorage.key(jndex), value: localStorage.getItem(localStorage.key(jndex)||"")}) ))
                                        }}/>
                                <ButtonMenuItem id={ids.settings + "/slider/console/localStorageClear"}
                                    label="[DEV] localStorage"
                                    button="CLEAR"
                                    onClick={ () => localStorage.clear() }/>
                            </SPanel>
                        </PanelSwitcher>
                    </>)}
                </div>

            </div>
        </>
    )
}

// <SelectMenuItem id=""
//                                 label="Source"
//                                 options={ ([{label:"Ayrlin", value:"ayrlin"}] as SelectOption[]) }/>
//                             <SelectMenuItem id=""
//                                 label="Source"
//                                 options={ ([{label:"Ayrlin", value:"ayrlin"}] as SelectOption[]) }/>

