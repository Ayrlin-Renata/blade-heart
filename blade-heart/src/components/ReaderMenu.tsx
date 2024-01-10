import { useContext, useState } from 'preact/hooks';

import { content as contentlist } from '../assets/json/contentlist.json';

import {
    MangaNavContext, MangaNavData, updateChapter, updateLanguage,
} from '../routes/ChapterReader.tsx';
import ReaderMenuHeader from './ReaderMenuHeader';
import LabelMenuItem from './LabelMenuItem';
import AccountMenuItem from './AccountMenuItem';
import SelectMenuItem, { SelectOption } from './SelectMenuItem';
import MenuDivider from './MenuDivider';
import PanelSwitcher from './PanelSwitcher.tsx';
import SPanel from './SPanel.tsx';

import ChatIcon from '@mui/icons-material/Chat';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import SliderMenuItem from './SliderMenuItem.tsx';
import ButtonMenuItem from './ButtonMenuItem.tsx';
import InputMenuItem from './InputMenuItem.tsx';

import DictionaryNoteEmbed from './DictionaryNoteEmbed.tsx';
import { idify } from '../utils/ayrutils.tsx';
import { getMangaMeta } from '../utils/jsonutils.tsx';
import { useLocation, useNavigate } from 'react-router-dom';

interface ReaderMenu {
    isCollapsed: boolean,
    onCollapse: Function,
}

export default function ({ isCollapsed, onCollapse }: ReaderMenu) {
    const mangaNav: MangaNavData = useContext(MangaNavContext);

    const mangaInfo = contentlist[mangaNav.manga.id as keyof typeof contentlist];

    const mangaMeta = getMangaMeta(mangaNav.manga.id);
    const langMeta = mangaMeta.lang(mangaNav.language.id);

    if (!mangaInfo || !mangaMeta || !langMeta) {
        console.warn("manga info not found!");
        console.warn({
            mangaNav: mangaNav,
            mangaInfo: mangaInfo,
            mangaMeta: mangaMeta,
            langMeta: langMeta
        });
        return (<div class="readermenu">{"manga info not found!"}</div>);
    }

    const [dictionarySearch, setDictionarySearch] = useState("");


    const ids = {
        language: (mangaNav.manga.id + "/mangalanguage"),
        chapter: (mangaNav.manga.id + "/mangachapter"),
        notes: (mangaNav.manga.id + "/panel/notes"),
        behaviours: (mangaNav.manga.id + "/panel/behaviours"),
        settings: (mangaNav.manga.id + "/panel/settings"),
        dictionary: (mangaNav.manga.id + "/panel/dictionary"),
    };
    const behaviourPresets = ["custom", "recommended"];

    const loc = useLocation();
    const navigate = useNavigate();

    function updateLang(opt: SelectOption): void {
        updateLanguage(opt.value, loc, navigate);
    }

    function updateChap(opt: SelectOption): void {
        updateChapter(JSON.parse(opt.value).id, loc, navigate)
    }


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
                            content={mangaNav.manga.label}
                            subContent={mangaInfo.subtitle} />
                        <SelectMenuItem id={ids.language}
                            label="Language"
                            options={Object.keys(mangaMeta.languages)
                                .map((lang: string) => {
                                    return { label: mangaMeta.languages[lang].name, value: lang }
                                })}
                            onChange={updateLang} />
                        <SelectMenuItem id={ids.chapter}
                            label="Chapter"
                            options={Object.keys(langMeta.chapters)
                                .map(key => { return { key: key, chap: langMeta.chapters[key] } })
                                .map(({ key, chap }) => {
                                    return {
                                        label: chap.authornumber + ": " + chap.name,
                                        value: JSON.stringify({
                                            id: idify(chap.name) || "",
                                            numeral: Number(key)
                                        })
                                    }
                                })}
                            onChange={updateChap} />
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
                                icon={<CallSplitIcon />}>
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
                                <ButtonMenuItem id={ids.settings + "/button/console/localStorageList"}
                                    label="[DEV] localStorage"
                                    button="LIST"
                                    onClick={function test() {
                                        console.log(Array
                                            .from({ length: localStorage.length }, (_, i) => i)
                                            .map((jndex) => ({ key: localStorage.key(jndex), value: localStorage.getItem(localStorage.key(jndex) || "") })))
                                    }} />
                                <ButtonMenuItem id={ids.settings + "/button/console/localStorageClear"}
                                    label="[DEV] localStorage"
                                    button="CLEAR"
                                    onClick={() => localStorage.clear()} />
                                <ButtonMenuItem id={ids.settings + "/button/console/mangaNavList"}
                                    label="[DEV] mangaNav"
                                    button="LIST"
                                    onClick={() => console.log(mangaNav)} />
                            </SPanel>
                            <SPanel id={ids.dictionary}
                                icon={<MenuBookIcon />}>
                                <LabelMenuItem id={ids.dictionary + "/label/title"}
                                    content="dictionary"
                                    subContent="lookup panel" />
                                <InputMenuItem id={ids.dictionary + "/input/dictionary"}
                                    label="Search"
                                    onEnter={(value) => {
                                        setDictionarySearch(value);
                                    }}
                                    autoClear />
                                <DictionaryNoteEmbed term={dictionarySearch} />
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

