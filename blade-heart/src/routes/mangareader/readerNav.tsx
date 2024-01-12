import { createSlice } from "@reduxjs/toolkit";

export const nav = createSlice({
    name: 'nav',
    initialState: {
        manga: "",
        lang: "",
        chap: ""
    },
    reducers: {
        update: (state, action) => {
            state = action.payload
        },
        manga: (state, action) => {
            state.manga = action.payload
        },
        lang: (state, action) => {
            state.lang = action.payload
        },
        chap: (state, action) => {
            state.chap = action.payload
        },
    },
})

const navSelectors = {
    select: (state:any) => {
        return state.nav
    },
    selectManga: (state: any) => {
        return state.nav?.manga || ""
    },
    selectLang: (state: any) => {
        return state.nav?.lang || ""
    },
    selectChap: (state: any) => {
        return state.nav?.chap || ""
    },
}

export const { select, selectManga, selectLang, selectChap } = navSelectors