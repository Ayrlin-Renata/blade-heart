import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db, useUserdata } from "./firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { QueryClient, useMutation } from "@tanstack/react-query"
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

    const auth = getAuth()
    const idkey = "prefs." + id

    //state
    const [pcState, setPcState] = useState({
        value: defaultValue,
        source: 'auth',
        prev: { value: defaultValue, source: 'auth' },
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
                    updatePCState('state', defaultValue)
                } else {
                    updatePCState('auth', userdata?.prefs[id])
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

        if (value == undefined) value = pcState.value
        if (source == 'state') {
            if (auth.currentUser) {
                setPcState({
                    value: value,
                    source: source,
                    prev: { value: pcState.value, source: pcState.source },
                })
            } else {
                setPcState({
                    value: value,
                    source: source,
                    prev: { value: pcState.value, source: pcState.source },
                })
            }
        } else if (source === 'guest'
            || (!((pcState.prev.source === 'auth' && pcState.prev.value === value)
                || (source === 'force' && pcState.prev.value === value)))) {
            setPcState({
                value: value,
                source: source,
                prev: { value: pcState.value, source: pcState.source },
            })
        }
    }

    useEffect(() => {
        if(pcState.source == 'state' && auth.currentUser) {
            //console.log('after state:' , pcState.value)
            //console.log('attempting mutation', idkey, pcState.value)
            mutateToValue.mutate()
        }
    }, [pcState])

    if (auth.currentUser) {
        const udRef = doc(db, 'userdata', auth.currentUser.uid)
        const { status } = useUserdata();
        const uid = auth.currentUser.uid

        //console.log('mutation value update', idkey, pcState.value)
        var mutateToValue = useMutation({
            mutationKey: [uid],
            mutationFn: () => {
                return updateDoc(udRef, {
                    [idkey]: pcState.value
                })
            },
            onSuccess: () => {
                //console.log('successMutation',data)
                qc.invalidateQueries({ queryKey: [uid] })
                //qc.setQueryData([uid], data)
            }
            //queryClient: qc
        })

        return {
            accType: 'auth',
            status: status == undefined? 'error' : status,
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