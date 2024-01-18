import { initializeApp } from "@firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
    getAuth,
    GoogleAuthProvider,
    TwitterAuthProvider,
    OAuthCredential,
    signInWithPopup
} from "firebase/auth";
import { useQuery } from "@tanstack/react-query";

//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7YQuc9HDbKdCgEOQ3GguyPZKWwbhjAaE",
    authDomain: "blade-heart.firebaseapp.com",
    projectId: "blade-heart",
    storageBucket: "blade-heart.appspot.com",
    messagingSenderId: "678675071896",
    appId: "1:678675071896:web:4ab410e224e65b2be521ed",
    measurementId: "G-NSL1K6G6ME"
};

// Initialize Firebase 
//@ts-ignore
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//@ts-ignore
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LcCuVApAAAAADLTqyEERhaJZlP0GV1OgI_1zCCU'),
    isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
});

const providerGoogle = new GoogleAuthProvider();
const providerTwitter = new TwitterAuthProvider();
export const providerList = [providerGoogle, providerTwitter];
const auth = getAuth();

const deviceLang = auth.useDeviceLanguage();
auth.languageCode = (deviceLang != null) ? deviceLang : 'en';

///GOOGLE

export async function loginPopupGoogle() {
    const res = {
        credential: null as OAuthCredential | null,
        token: undefined as string | undefined,
        user: undefined as any | undefined,
    }
    const err = {
        error: false,
        errorCode: undefined as any,
        errorMessage: undefined as any,
        credential: null as OAuthCredential | null,
    }
    await signInWithPopup(auth, providerGoogle)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            res.credential = GoogleAuthProvider.credentialFromResult(result);
            res.token = res.credential?.accessToken;
            // The signed-in user info.
            res.user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            checkAndCreateUserFile(result.user.uid)

        }).catch((error) => {
            err.error = true
            // Handle Errors here.
            err.errorCode = error.code;
            err.errorMessage = error.message;
            // The AuthCredential type that was used.
            err.credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

    return { res, err }
}

/// TWITTER
export async function loginPopupTwitter() {
    const res = {
        credential: null as OAuthCredential | null,
        token: undefined as string | undefined,
        secret: undefined as any,
        user: undefined as any | undefined,
    }
    const err = {
        error: false,
        errorCode: undefined as any,
        errorMessage: undefined as any,
        credential: null as OAuthCredential | null,
    }
    await signInWithPopup(auth, providerTwitter)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            res.credential = TwitterAuthProvider.credentialFromResult(result);
            res.token = res.credential?.accessToken;
            res.secret = res.credential?.secret;
            // The signed-in user info.
            res.user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            checkAndCreateUserFile(result.user.uid)

        }).catch((error) => {
            err.error = true
            // Handle Errors here.
            err.errorCode = error.code;
            err.errorMessage = error.message;
            // The AuthCredential type that was used.
            err.credential = TwitterAuthProvider.credentialFromError(error);
            // ...
        });

    return { res, err }
}

// FIREBASE DATABASE

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);


async function checkAndCreateUserFile(uid: string) {
    const docRef = doc(db, "userdata", uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
        console.log("Found userfile for user.");
        //const version = userDoc.data().meta.v
        //update format if needed
    } else {
        console.log('Creating userfile for user.')
        const userdata = collection(db, "userdata");
        await setDoc(doc(userdata, uid), {
            meta: {
                v: 1
            },
            prefs: {},
            prefsets: {}
        });
    }
}

export function useUserdata(): { status: "error" | "success" | "pending" | undefined, data: any } {
    const uid = auth.currentUser?.uid
    if (uid) {
        const udRef = doc(db, 'userdata', uid)
        const { status, data } = useQuery({
            queryKey: [uid],
            queryFn: () => {
                return getDoc(udRef)
            },
            staleTime: 300000,
        })
        return { status: status, data: data?.data() }
    }
    return { status: undefined, data: undefined }
}

// export function getUserdataField(field: string, defaultValue: any) {
//     const userdata = getUserdata()
//     if (!(userdata.uid) || userdata.status !== "success") return userdata
//     if (!userdata.data[field]) {
//         const newData: any = userdata.data as any
//         newData[field] = defaultValue
//         setUserdata(uid, newData)
//     }
// }

// export function getUserdata(): { uid: string, status: "error" | "success" | "pending", data: any } {
//     //Firebase
//     const uid: string = getAuth().currentUser?.uid || ""

//     if (uid) {
//         const { status, data } = useQuery({
//             queryKey: [uid],
//             queryFn: () => {
//                 const docRef = doc(db, "userdata", uid);
//                 return getDoc(docRef);
//             }
//         })

//         const d = data?.data()
//         return { uid, status, data: d }

//         //console.log('uid', uid)
//     } else {
//         //GUEST USER
//         return { uid, status: 'error', data: {} }
//     }
// }

// export function setUserdata(uid: string, userdata: any) {
//     const mutation = useMutation({
//         mutationFn: (userdata) => {
//             const docRef = doc(db, "userdata", uid);
//             return setDoc(docRef, userdata as WithFieldValue<DocumentData>)
//         },
//     })
// }