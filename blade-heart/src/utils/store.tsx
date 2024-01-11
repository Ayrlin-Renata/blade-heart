import { configureStore } from '@reduxjs/toolkit'

import { nav } from '@/routes/mangareader/readerNav'

export default configureStore({
    reducer: {
        nav: nav.reducer,
    }
  })