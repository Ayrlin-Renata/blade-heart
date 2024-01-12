import { configureStore } from '@reduxjs/toolkit'

import { nav } from '@/routes/mangareader/readerNav'
import { readermenu } from '@/routes/mangareader/menu/menuPref'

export default configureStore({
    reducer: {
        nav: nav.reducer,
        readermenu:  readermenu.reducer,
    }
  })