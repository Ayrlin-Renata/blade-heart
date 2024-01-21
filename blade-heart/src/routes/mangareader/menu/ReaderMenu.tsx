import { useContext, useEffect, useState } from 'preact/hooks';

import { content as contentlist } from '../../../assets/json/contentlist.json';

import ReaderMenuHeader from './MenuHeader.tsx';
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EditNoteIcon from '@mui/icons-material/EditNote';

import SliderMenuItem from './SliderMenuItem.tsx';
import ButtonMenuItem from './ButtonMenuItem.tsx';
import InputMenuItem from './InputMenuItem.tsx';

import DictionaryNoteEmbed from '../notebar/DictionaryNoteEmbed.tsx';
import { idify } from '../../../utils/ayrutils.tsx';
import { getMeta } from '../../../utils/jsonutils.ts';

import '@/css/mangareader/menu/readermenu.scss'
import '@/css/mangareader/menu/menuitem.scss'
import { useNavigate } from 'react-router-dom';
import { NavContext, ReaderView, ViewContext } from '../Reader.tsx';

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

    const rView = useContext(ViewContext)

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
            const prevScroll = rView.viewScroll

            const lang = goto.type === 'lang' ? goto.id : mNav.langid
            const chap = goto.type === 'chap' ? goto.id : mNav.chapid
            const url = ['/blade-heart/manhua', mNav.mangaid, lang, chap].join('/')
            //console.log('goto:', url)
            navigate(url)
            rView.addToLoadQueue({
                id: "viewScroll", fun: (rv: ReaderView) => {
                    //console.log("SCROLL EXECUTE:", goto.type, prevScroll, rv)
                    if (goto.type === 'lang') {
                        rv.scrollTo('px', prevScroll, true);
                    } else if (goto.type === 'chap') {
                        //rv.viewScroll = 0
                        rv.scrollTo('px',0, true);
                    }
                }
            })
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
        language: (mNav.mangaid + "|sct|language"), //select|language
        chapter: (mNav.mangaid + "|sct|chapter"),
        notes: (mNav.mangaid + "|pnl|notes"), //panel/notes
        behaviours: (mNav.mangaid + "|pnl|behaviours"),
        editing: (mNav.mangaid + "|pnl|editing"),
        audio: (mNav.mangaid + "|pnl|audio"),
        settings: (mNav.mangaid + "|pnl|settings"),
        dictionary: (mNav.mangaid + "|pnl|dictionary"),
    };
    const behaviourPresets = ["custom", "recommended"]
    const notelang = ["English"]
    const notesrc = ["ayrlin"]

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
                                const lbl = (chap.authornumber.length == 0 ? "" : chap.authornumber + ": ")
                                    + (chap.displayname.length == 0 ? chap.name : chap.displayname)
                                return {
                                    label: lbl,
                                    value: JSON.stringify({
                                        id: idify(chap.name) || "",
                                        numeral: Number(key)
                                    })
                                }
                            })}
                        onChange={navChapter}
                        set={
                            {
                                label: (chapMeta.authornumber.length == 0 ? "" : chapMeta.authornumber + ": ")
                                    + (chapMeta.displayname.length == 0 ? chapMeta.name : chapMeta.displayname),
                                value: JSON.stringify({
                                    id: idify(chapMeta.name) || "",
                                    numeral: chapNumeral
                                })
                            }
                        } />
                    <PanelSwitcher>
                        <SPanel id={ids.audio}
                            icon={<VolumeUpIcon />}>
                            <LabelMenuItem id={ids.audio + "|lbl|ttl"}
                                content="audio"
                                subContent="settings panel" />
                            <SliderMenuItem id={ids.audio + "|sld|bgm"}
                                key={ids.audio + "|sld|bgm"}
                                offText="off"
                                onText="on"
                                label="Background Music"
                                defaultValue={false}
                                disabled />
                            <SliderMenuItem id={ids.audio + "|sld|sfx"}
                                key={ids.audio + "|sld|sfx"}
                                offText="off"
                                onText="on"
                                label="Sound Effects"
                                defaultValue={false}
                                disabled />
                        </SPanel>


                        <SPanel id={ids.behaviours}
                            icon={<CallSplitIcon />}>
                            <LabelMenuItem id={ids.behaviours + "|lbl|ttl"}
                                content="behaviours"
                                subContent="preferences panel" />
                            <SelectMenuItem id={ids.behaviours + "|sct|test"} //select|test
                                label="Presets"
                                options={behaviourPresets.map((pres: string) => { return { label: pres, value: pres } })}
                                disabled />
                            <SliderMenuItem id={ids.behaviours + "|sld|loadscrn"}
                                key={ids.notes + "|sld|loadscrn"}
                                offText="off"
                                onText="on"
                                label="Use Load Screen"
                                defaultValue={false}
                                disabled />
                        </SPanel>

                        <SPanel id={ids.settings}
                            icon={<SettingsIcon />}>
                            <LabelMenuItem id={ids.settings + "|lbl|ttl"}
                                content="settings"
                                subContent="preferences panel" />
                            <ButtonMenuItem id={ids.settings + "|btn|csl|localStorageList"}
                                label="[DEV] localStorage"
                                children="LIST"
                                onClick={function test() {
                                    console.log(Array
                                        .from({ length: localStorage.length }, (_, i) => i)
                                        .map((jndex) => ({ key: localStorage.key(jndex), value: localStorage.getItem(localStorage.key(jndex) || "") })))
                                }} />
                            <ButtonMenuItem id={ids.settings + "|btn|csl|localStorageClear"}
                                label="[DEV] localStorage"
                                children="CLEAR"
                                onClick={() => localStorage.clear()} />
                        </SPanel>
                        <SPanel id={ids.notes}
                            icon={<ChatIcon />}>
                            <LabelMenuItem id={ids.notes + "|lbl|ttl"}
                                content="notes"
                                subContent="preferences panel" />
                            <SelectMenuItem id={ids.notes + "|sct|notelang"} //select|notelang
                                label="Note Language"
                                options={notelang.map((pres: string) => { return { label: pres, value: pres } })}
                                disabled />
                            <SelectMenuItem id={ids.notes + "|sct|notesrc"}
                                label="Note Source"
                                options={notesrc.map((pres: string) => { return { label: pres, value: pres } })}
                                disabled />
                            <SliderMenuItem id={ids.notes + "|sld|visdef"}
                                key={ids.notes + "|sld|visdef"}
                                offText="hide"
                                onText="show"
                                label="Shown by Default"
                                defaultValue={false}
                                disabled />
                            <LabelMenuItem id={ids.notes + "|lbl|ctg"}
                                content="categories"
                                subContent='note visibility' />
                            <SliderMenuItem id={ids.notes + "|sld|ctg|language"}
                                key={ids.notes + "|sld|ctg|language"}
                                offText="hide"
                                onText="show"
                                label="Language"
                                defaultValue={true} />
                            <SliderMenuItem id={ids.notes + "|sld|ctg|translation"}
                                key={ids.notes + "|sld|ctg|translation"}
                                offText="hide"
                                onText="show"
                                label="Translation"
                                defaultValue={true} />
                            <SliderMenuItem id={ids.notes + "|sld|ctg|pronunciation"}
                                key={ids.notes + "|sld|ctg|pronunciation"}
                                offText="hide"
                                onText="show"
                                label="Pronunciation"
                                defaultValue={true} />
                            <SliderMenuItem id={ids.notes + "|sld|ctg|context"}
                                key={ids.notes + "|sld|ctg|context"}
                                offText="hide"
                                onText="show"
                                label="Context"
                                defaultValue={true} />
                            <SliderMenuItem id={ids.notes + "|sld|ctg|extra"}
                                key={ids.notes + "|sld|ctg|extra"}
                                offText="hide"
                                onText="show"
                                label="Extras"
                                defaultValue={false} />
                            <SliderMenuItem id={ids.notes + "|sld|ctg|feature"}
                                key={ids.notes + "|sld|ctg|feature"}
                                offText="hide"
                                onText="show"
                                label="Features"
                                defaultValue={true} />
                        </SPanel>

                        <SPanel id={ids.editing}
                            icon={<EditNoteIcon />}>
                            <LabelMenuItem id={ids.editing + "|lbl|ttl"}
                                content="editing"
                                subContent="preferences panel" />
                        </SPanel>

                        <SPanel id={ids.dictionary}
                            icon={<MenuBookIcon />}>
                            <LabelMenuItem id={ids.dictionary + "|lbl|ttl"}
                                content="dictionary"
                                subContent="lookup panel" />
                            <InputMenuItem id={ids.dictionary + "|in|dictionary"}
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

