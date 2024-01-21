import { MangaNav, ReaderPage } from '@/routes/mangareader/Reader';
import { content as contentmeta } from '../assets/json/contentmeta.json';
import { idify } from './ayrutils';

export interface MangaMeta {
    title: string,
    languages: any, //object params are MangaLanguage
    lang: (lang?: string) => MangaMetaLanguage
}

export interface MangaMetaLanguage {
    name: string,
    mangatitle: string,
    credit: { position: string, creditname: string[] }[],
    sourcecredit: string,
    sourceurl: string,
    chapters: any, //object params are MangaChapter 
    chap: (chap?: number) => MangaMetaChapter
}

export interface MangaMetaChapter {
    authornumber: string,
    name: string,
    displayname: string,
    pagemethod: "local" | "fetch-source" | "patch-source",
    pagedata: [number, number] | (string | [number, number])[],
    imageext: string,
    suggestzoom: number[],
    nopagegap: number[],
    metanotes: string,
    getPageCount: () => number
}

export function getMangaMeta(id: string): (MangaMeta) {
    const mm: any = contentmeta[id as keyof typeof contentmeta];
    if (!mm) {
        console.warn("incorrect manga id: " + id);
    }

    function mmGetLang(lang?: string): (MangaMetaLanguage) {
        if (!lang) lang = firstKey(mm.languages);
        const mml: MangaMetaLanguage = mm.languages[lang as keyof typeof mm.languages];
        if (!mml) {
            console.warn("incorrect language id: " + lang);
        }

        function mmlGetChap(chap?: number) {
            if (!chap) chap = firstKey(mml.chapters);
            const mmc: MangaMetaChapter = mml.chapters[chap as keyof typeof mml.chapters];
            if (!mmc) {
                console.warn("incorrect chapter id: " + chap);;
            }

            function mmcPageCount() {
                switch (mmc.pagemethod) {
                    case "local":
                    case "fetch-source": {
                        const end: number = mmc.pagedata[1] as number
                        const start: number = mmc.pagedata[0] as number
                        return (end - start) + 1;
                    } break;
                    case "patch-source": {
                        var pageCount = 0;
                        for (const data of mmc.pagedata) {
                            if (typeof data === "string") {
                                pageCount++;
                            } else {
                                const dt: [number,number] = data as [number, number]
                                const end: number = dt[1] as number
                                const start: number = dt[0] as number
                                pageCount += (end - start) + 1;
                            }
                        }
                        return pageCount;
                    } break;
                    default: {
                        return NaN;
                    }
                }
            }

            const mangaMetaChapter: MangaMetaChapter = { ...mmc, getPageCount: mmcPageCount }
            return mangaMetaChapter;
        }

        const mangaMetaLang: MangaMetaLanguage = { ...mml, chap: mmlGetChap }
        return mangaMetaLang;
    }

    const mangaMeta: MangaMeta = { ...mm, lang: mmGetLang }
    return mangaMeta;
}

export function getMeta(mNav: MangaNav) {
    const mangaMeta = getMangaMeta(mNav.mangaid)
    const langMeta = mangaMeta.lang(mNav.langid)
    const chapNumeral = numeralFromNav(mNav)
    const chapMeta = langMeta.chap(chapNumeral)
    return { mangaMeta, langMeta, chapMeta, chapNumeral }
}

export function firstKey(o: any): any {
    return Object.keys(o)[0];
}

export function numeralFromNav(mNav: MangaNav) {
    return numeralFromChapId(mNav.mangaid, mNav.langid, mNav.chapid);
}

export function numeralFromChapId(mangaid: string, langid: string, chapid: string) {
    const mangaMeta = getMangaMeta(mangaid);
    const langMeta = mangaMeta.lang(langid);
    const foundChap = Object.entries(langMeta.chapters)
        //@ts-ignore
        .find(([key, chap]: any) => { return idify(chap.name) == chapid });
    return Number(foundChap?.[0])
}

export interface Size2 {
    height: number,
    width: number,
}

function buildPageUrl(pagestart: number, pageend: number, paddingLength: number, prefix: string, ext: string) {
    //console.log("BUILD:", pagestart, pageend, paddingLength, prefix, ext)
    const srcs: string[] = []
    for(let srcNum = pagestart; srcNum <= pageend; srcNum++ ) {
        //console.log(srcNum)
        srcs.push(prefix + srcNum.toString().padStart(paddingLength, '0') + '.' + ext)
    }
    return srcs
}

export function loadPageMeta(mNav: MangaNav): ReaderPage[] {
    const pages: ReaderPage[] = []

    const { langMeta, chapMeta, chapNumeral } = getMeta(mNav)
    let pageSrcs: string[] = []

    switch (chapMeta.pagemethod) {
        case 'local':
        case 'fetch-source': {
            const isLocal = chapMeta.pagemethod === 'local'
            const pagestart = chapMeta.pagedata[0] as number + (isLocal ? -1 : 0)
            const pageend = chapMeta.pagedata[1] as number + (isLocal ? -1 : 0)
            const chapPrefix = langMeta.sourceurl + chapNumeral + '/'
            const paddingLength = isLocal? 2 : 4
            pageSrcs = buildPageUrl(pagestart, pageend, paddingLength, chapPrefix, chapMeta.imageext)
        } break;
        case 'patch-source': {
            for(const pageData of chapMeta.pagedata) {
                if(typeof pageData === 'string') {
                    pageSrcs.push(pageData)
                } else if(Array.isArray(pageData)) {
                    const pagestart = pageData[0] as number
                    const pageend = pageData[1] as number
                    const chapPrefix = langMeta.sourceurl + chapNumeral + '/'
                    const paddingLength = 4
                    pageSrcs.push(...buildPageUrl(pagestart, pageend, paddingLength, chapPrefix, chapMeta.imageext))
                }
            }

        } break;
    }

    for (let pageidx = 0; pageidx < chapMeta.getPageCount(); pageidx++) {
        const page = {
            numeral: pageidx + 1,
            src: pageSrcs[pageidx],
            origSize: {
                height: 0,
                width: 0
            } as Size2,
            viewHeight: NaN,
            suggestZoom: chapMeta.suggestzoom.includes(pageidx+1),
            noPageGap: chapMeta.nopagegap.includes(pageidx+1),
            getImg: getImg,
            loaded: false,
        }

        function getImg() {
            const image: HTMLImageElement = new Image()
            image.id = 'page' + page.numeral
            image.src = page.src
            return image
        }

        pages.push(page)
    }
    return pages
}
