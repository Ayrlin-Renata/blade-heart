import { createSlice } from "@reduxjs/toolkit";

export const nav = createSlice({
    name: 'nav',
    initialState: {
        nav: {
            manga: "",
            lang: "",
            chap: ""
        },
    },
    reducers: {
        update: (state, action) => {
            state.nav = action.payload
        },
        manga: (state, action) => {
            state.nav.manga = action.payload
        },
        lang: (state, action) => {
            state.nav.lang = action.payload
        },
        chap: (state, action) => {
            state.nav.chap = action.payload
        },
    },
})

const navSelectors = {
    selectManga: (state: any) => {
        return state.nav.nav?.manga || ""
    },
    selectLang: (state: any) => {
        return state.nav.nav?.lang || ""
    },
    selectChap: (state: any) => {
        return state.nav.nav?.chap || ""
    },
}

export const { selectManga, selectLang, selectChap } = navSelectors