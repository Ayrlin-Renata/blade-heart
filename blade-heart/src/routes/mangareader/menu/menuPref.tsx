import { createSlice } from "@reduxjs/toolkit";

export interface SliderPref {
    id: string,
    state: boolean
}

export const readermenu = createSlice({
    name: 'readermenu',
    initialState: {
        prefs: {
            sliders: [] as SliderPref[]
        }
    },
    reducers: {
        update: (state, action) => {
            state = action.payload
        },
        updateSlider: (state, action) => {
            const newPref: SliderPref = action.payload as SliderPref
            const foundPref: SliderPref | undefined = state.prefs.sliders.find((pref) => pref.id === newPref.id)
            if(!foundPref) {
                state.prefs.sliders.push(newPref)
                return
            }
            foundPref.state = newPref.state
        },
    },
})

const readermenuSelectors = {
    selectSlider: (state: any) => {
        return state.readermenu.prefs.sliders.find(state as string) 
    },
}

export const { selectSlider } = readermenuSelectors