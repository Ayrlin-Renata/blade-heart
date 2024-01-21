import '@/css/components/loading.scss'
// import BladeHeartIcon from './icons/BladeHeartIcon'
import { useState } from 'preact/hooks'
import { createRef } from 'preact'
import BladeHeartSword from './icons/BladeHeartSword'

interface Loading {
    style?: string,
    size?: 'large' | 'small',
    status: boolean
}

export default function ({ size, style, status }: Loading) {
    if (!size) size = 'small'

    const [lstatus, setLStatus] = useState('none')
    const timerRef = createRef()

    if (status) {
        //trying to load
        switch (lstatus) {
            case 'none': {
                setLStatus('preloading')
                if (!timerRef.current)
                    timerRef.current = setTimeout(() => setLStatus('loading'), 500)
            } break;
            case 'preloading': {
                if (timerRef.current)
                    clearTimeout(timerRef.current)
            } break;
            case 'loading': {
                if (timerRef.current)
                    clearTimeout(timerRef.current)
            } break;
            case 'unloading': {
                setLStatus('none')
                if (timerRef.current)
                    clearTimeout(timerRef.current)
            } break;
        }
    } else {
        //trying not to load
        switch (lstatus) {
            case 'none': {
                if (timerRef.current)
                    clearTimeout(timerRef.current)

            } break;
            case 'preloading': {
                setLStatus('none')
                if (timerRef.current)
                    clearTimeout(timerRef.current)
            } break;
            case 'loading': {
                setLStatus('unloading')
                if (!timerRef.current)
                    timerRef.current = setTimeout(() => setLStatus('none'), 300)
            } break;
            case 'unloading': {
                //wait til none
                if (timerRef.current)
                    clearTimeout(timerRef.current)
            } break;
        }
    }

    // setLStatus((_prev) => "preloading")
    // setTimeout(() => {
    //     setLStatus((prev) => {
    //         if (prev === "preloading") {
    //             return "loading"
    //         } else {
    //             return prev
    //         }
    //     })
    // }, 15)

    // setLStatus((_prev) => "unloading")
    // setTimeout(() => {
    //     setLStatus((prev) => {
    //         if (prev === "unloading") {
    //             return "none"
    //         } else {
    //             return prev
    //         }
    //     })
    // }, 150)
    //console.log(lstatus)

    if (lstatus === 'none') {
        return (<></>)
    }

    return (
        <>
            <div class={lstatus === 'preloading' ? "contentloading"
                : lstatus === 'loading' ? "contentloading active" : "contentloading unactive"}
                style={style}>
                <div class={size === 'large' ? "loadingcard large" : "loadingcard small"}>
                    {size === 'large' ?
                        (<>
                            <BladeHeartSword />
                            <div class="titlewords bh-wordmark">
                                <h1>BLADE</h1>
                                <h1>HEART</h1>
                            </div>

                        </>)
                        : (<>
                            <div class="text">Loading...</div>
                        </>)}
                </div>
            </div>
        </>
    )
}