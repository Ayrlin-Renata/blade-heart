import { useContext, useState } from 'preact/hooks';

import { content as contentlist } from '../../../assets/json/contentlist.json';

import ReaderMenuHeader from './ReaderMenuHeader';
import LabelMenuItem from './LabelMenuItem.tsx';
import AccountMenuItem from './AccountMenuItem.tsx';
import SelectMenuItem, { SelectOption } from './SelectMenuItem.tsx';
import MenuDivider from './MenuDivider.tsx';
import PanelSwitcher from './PanelSwitcher.tsx';
import SPanel from './SPanel.tsx';

import ChatIcon from '@mui/icons-material/Chat';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import SliderMenuItem from './SliderMenuItem.tsx';
import ButtonMenuItem from './ButtonMenuItem.tsx';
import InputMenuItem from './InputMenuItem.tsx';

import DictionaryNoteEmbed from '../notebar/DictionaryNoteEmbed.tsx';
import { idify } from '../../../utils/ayrutils.tsx';
import { getMangaMeta } from '../../../utils/jsonutils.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectManga, selectLang, selectChap, nav } from '../readerNav.tsx';

import '@/css/mangareader/menu/readermenu.scss'

interface ReaderMenu {
    isCollapsed: boolean,
    onCollapse: Function,
}

export default function ({ isCollapsed, onCollapse }: ReaderMenu) {

    const dispatch = useDispatch()
    // const mangaid = useSelector((state:any) => { return state.nav?.manga || "" })
    // const langid = useSelector((state:any) => { return state.nav?.lang || "" })
    const mangaid = useSelector(selectManga)
    const langid = useSelector(selectLang)
    const chapid = useSelector(selectChap)
    if (!mangaid || !langid || !chapid) {
        console.warn(mangaid, langid, chapid);
        return (<div>Loading...</div>);
    }

    const mangaInfo = contentlist[mangaid as keyof typeof contentlist]
    const mangaMeta = getMangaMeta(mangaid)
    const langMeta = mangaMeta.lang(langid)

    if (!mangaInfo || !mangaMeta || !langMeta) {
        console.warn("manga info not found!")
        console.warn({
            mangaInfo: mangaInfo,
            mangaMeta: mangaMeta,
            langMeta: langMeta
        });
        return (<div class="readermenu">{"manga info not found!"}</div>)
    }

    const [dictionarySearch, setDictionarySearch] = useState("")


    const ids = {
        language: (mangaid + "/mangalanguage"),
        chapter: (mangaid + "/mangachapter"),
        notes: (mangaid + "/panel/notes"),
        behaviours: (mangaid + "/panel/behaviours"),
        settings: (mangaid + "/panel/settings"),
        dictionary: (mangaid + "/panel/dictionary"),
    };
    const behaviourPresets = ["custom", "recommended"]



    return (
        <>
            <div class="readermenu">
                <button class={isCollapsed ? "collapsebtn collapsed" : "collapsebtn"} onClick={() => onCollapse(!isCollapsed)}>{isCollapsed ? '‹' : '›'}</button>
                <div class={isCollapsed ? "contentarea collapsed" : "contentarea"} >
                    <ReaderMenuHeader />
                    <AccountMenuItem />
                    <MenuDivider />
                    <LabelMenuItem id="mangatitle"
                        content={mangaMeta.title}
                        subContent={mangaInfo.subtitle} />
                    <SelectMenuItem id={ids.language}
                        label="Language"
                        options={Object.keys(mangaMeta.languages)
                            .map((lang: string) => {
                                return { label: mangaMeta.languages[lang].name, value: lang }
                            })}
                        onChange={
                            (opt) => dispatch(nav.actions.lang(opt.value))
                        } />
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
                        onChange={
                            (opt) => dispatch(nav.actions.chap(JSON.parse(opt.value).id))
                        } />
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

