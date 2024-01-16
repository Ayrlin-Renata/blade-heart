import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "./firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "preact/hooks"



export function usePrefComponent(id: string,
    qc: QueryClient,
    defaultValue: any)
    : {
        accType: 'auth' | 'guest',
        status: "error" | "success" | "pending",
        pcState: any,
        updatePCState: (source: 'state' | 'auth' | 'guest' | 'force', value?: any) => void
    } {
    const idkey = "prefs." + id

    //state
    const [pcState, setPcState] = useState({
        value: defaultValue,
        source: 'auth',
        prev: { value: defaultValue, source: 'auth' }
    })

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            //console.log(' auth hook')
            if (user) {
                const udRef = doc(db, 'userdata', user.uid)
                const data = await qc.fetchQuery({
                    queryKey: [user.uid],
                    queryFn: () => {
                        return getDoc(udRef)
                    },
                    staleTime: 300000,
                })

                const userdata = data.data()
                if (userdata?.prefs[id] == undefined) {
                    updateDoc(udRef, {
                        [idkey]: defaultValue
                    })
                } else {
                    updatePCState('auth', userdata.prefs[id])
                }
            } else {
                //logged out
                console.log('guest user')
                updatePCState('guest')
            }
        })

    }, [])

    function updatePCState(source: 'state' | 'auth' | 'guest' | 'force', value?: any) {
        //console.log('uHistory', source, value)
        const auth = getAuth()
        const idkey = 'prefs.' + id

        if (value == undefined) value = pcState.value
        if (source == 'state') {
            if (auth.currentUser) {
                const udRef = doc(db, 'userdata', auth.currentUser.uid)
                updateDoc(udRef, {
                    [idkey]: value
                })
            }
            setPcState({
                value: value,
                source: source,
                prev: { value: pcState.value, source: pcState.source }
            })
        } else if (source === 'guest'
            || (!((pcState.prev.source === 'auth' && pcState.prev.value === value)
                || (source === 'force' && pcState.prev.value === value)))) {
            setPcState({
                value: value,
                source: source,
                prev: { value: pcState.value, source: pcState.source }
            })
        }
    }

    const auth = getAuth()
    if (auth.currentUser) {
        const udRef = doc(db, 'userdata', auth.currentUser.uid)
        const { status } = useQuery({
            queryKey: [auth.currentUser.uid],
            queryFn: () => {
                return getDoc(udRef)
            },
            staleTime: 300000,
        })
        return {
            accType: 'auth',
            status: status,
            pcState: pcState,
            updatePCState: updatePCState
        }
    }
    return {
        accType: 'guest',
        status: 'error',
        pcState: pcState,
        updatePCState: updatePCState
    }
}