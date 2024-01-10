import { Location as RouterLocation } from 'react-router-dom';

export function getIdsFromUrl(location: RouterLocation): { prepath: string, mangaid: string, langid: string, chapterid: string } {
    const parts = location.pathname.split('/');
    const mid = parts.slice(-3, -2).toString();
    const lid = parts.slice(-2, -1).toString();
    const cid = parts.slice(-1).toString();
    return { prepath: parts.slice(0, -3).join('/'), mangaid: mid, langid: lid, chapterid: cid }
}