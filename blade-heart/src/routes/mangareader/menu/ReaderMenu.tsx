import { useContext, useEffect, useState } from 'preact/hooks';

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
import { getMeta } from '../../../utils/jsonutils.tsx';

import '@/css/mangareader/menu/readermenu.scss'
import '@/css/mangareader/menu/menuitem.scss'
import { useNavigate } from 'react-router-dom';
import { NavContext } from '../Reader.tsx';

interface GoTo {
    type: 'lang' | 'chap',
    id: string
}

interface ReaderMenu {
    isCollapsed: boolean,
    onCollapse: Function,
}

export default function ({ isCollapsed, onCollapse }: ReaderMenu) {
    const navigate = useNavigate()
    const [goto, setGoto] = useState({} as GoTo);

    function navLang(opt: SelectOption): void {
        const gtId: string = opt.value
        navGoTo({ type: 'lang', id: gtId })
    }

    function navChapter(opt: SelectOption): void {
        const gtId: string = JSON.parse(opt.value).id
        navGoTo({ type: 'chap', id: gtId })
    }

    function navGoTo(gt: GoTo) {
        if (goto != gt) {
            setGoto(gt)
        }
    }

    useEffect(() => {
        if (goto) {
            const lang = goto.type === 'lang' ? goto.id : mNav.langid
            const chap = goto.type === 'chap' ? goto.id : mNav.chapid
            const url = ['/blade-heart/manhua', mNav.mangaid, lang, chap].join('/')
            //console.log('goto:', url)
            navigate(url)
        }
    }, [goto])

    const mNav = useContext(NavContext)

    if (!mNav.mangaid || !mNav.langid || !mNav.chapid) {
        console.warn(mNav.mangaid, mNav.langid, mNav.chapid);
        return (<div>Loading...</div>);
    }

    const mangaInfo = contentlist[mNav.mangaid as keyof typeof contentlist]
    const { mangaMeta, langMeta, chapMeta, chapNumeral } = getMeta(mNav)

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
        language: (mNav.mangaid + "/mangalanguage"),
        chapter: (mNav.mangaid + "/mangachapter"),
        notes: (mNav.mangaid + "/panel/notes"),
        behaviours: (mNav.mangaid + "/panel/behaviours"),
        settings: (mNav.mangaid + "/panel/settings"),
        dictionary: (mNav.mangaid + "/panel/dictionary"),
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
                        onChange={navLang}
                        set={
                            { label: langMeta.name, value: mNav.langid }
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
                        onChange={navChapter}
                        set={
                            {
                                label: chapMeta.authornumber + ": " + chapMeta.name,
                                value: JSON.stringify({
                                    id: idify(chapMeta.name) || "",
                                    numeral: chapNumeral
                                })
                            }
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

