import { content as contentmeta } from '../assets/json/contentmeta.json';

export interface MangaMeta {
    title: string,
    author: string,
    languages: any, //object params are MangaLanguage
    lang: (lang?: string) => MangaMetaLanguage
}

export interface MangaMetaLanguage {
    name: string,
    translator: string,
    sourcecredit: string,
    sourceurl: string,
    chapters: any, //object params are MangaChapter 
    chap: (chap?: number) => MangaMetaChapter
}

export interface MangaMetaChapter {
    authornumber: string,
    name: string,
    pagemethod: "local" | "fetch-source" | "patch-source",
    pagedata: [number, number] | (string | [number, number])[],
    imageext: string,
    getPageCount: () => number
}

export function getMangaMeta(id: string): (MangaMeta) {
    const mm: any = contentmeta[id as keyof typeof contentmeta];
    if (!mm) {
        console.warn("incorrect manga id: " + id);
    }

    function mmGetLang(lang?: string): (MangaMetaLanguage) {
        if (!lang) lang = firstKey(mm.languages);
        const mml: any = mm.languages[lang as keyof typeof mm.languages];
        if (!mml) {
            console.warn("incorrect language id: " + lang);
        }

        function mmlGetChap(chap?: number) {
            if (!chap) chap = firstKey(mml.chapters);
            const mmc: any = mml.chapters[chap as keyof typeof mml.chapters];
            if (!mmc) {
                console.warn("incorrect chapter id: " + chap);;
            }

            function mmcPageCount() {
                switch (mmc.pagemethod) {
                    case "local":
                    case "fetch-source": {
                        return (mmc.pagedata[1] - mmc.pagedata[0]) + 1;
                    } break;
                    case "page-source": {
                        var pageCount = 0;
                        for (const data of mmc.pagedata) {
                            if (typeof data === "string") {
                                pageCount++;
                            } else {
                                pageCount += (data[1] - data[0]) + 1;
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

function firstKey(o: any): any {
    return Object.keys(o)[0];
}

// function firstValue(o: any): any {
//     return o[firstKey(o)];
// }

export function buildPageSrc(
    page: number,
    chap: number,
    lang: string,
    manga: string,
): { src: string, type: string } {
    const langMeta: MangaMetaLanguage = getMangaMeta(manga).lang(lang);
    const chapMeta = langMeta.chap(chap);
    const pm = chapMeta.pagemethod || "local";
    return {
        src: buildPageSrcFromValues(page, pm, langMeta.sourceurl, chap, chapMeta.imageext || "jpg"),
        type: "image/" + chapMeta.imageext
    }
}

export function buildPageSrcFromValues(
    page: number,
    pagemethod: ("fetch-source" | "patch-source" | "local"),
    langsource: string,
    chapNumeral: number,
    imageext: string,
    pagedata?: any[]
): string {
    switch (pagemethod) {
        case "fetch-source":
        case "local": {
            const isLocal: boolean = pagemethod === "local";
            const chapString = langsource + chapNumeral + "/";
            const pageString = page.toString().padStart(isLocal ? 2 : 4, "0");
            const extString = "." + imageext;
            return chapString + pageString + extString;
        } break;
        case "patch-source": {
            var countedPage = 0;
            if (!pagedata) return "";
            for (const val of pagedata) {
                if (typeof val === "string") {
                    countedPage++;
                    if (page == countedPage) return val;

                } else if (Array.isArray(val)) {
                    for (let j = val[0]; j <= val[1]; j++) {
                        page++;
                        if (page == countedPage) {
                            return langsource + chapNumeral + "/" + j.toString().padStart(4, '0') + "." + imageext;
                        }
                    }
                }
            }
        } break;
        default: { }
    }
    return "";
}