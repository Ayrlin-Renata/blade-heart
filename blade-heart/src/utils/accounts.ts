import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider, OAuthCredential, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

const deviceLang = auth.useDeviceLanguage();
auth.languageCode = (deviceLang != null) ? deviceLang : 'en';

export function loginPopup() {

    const res = {
        credential: null as OAuthCredential | null,
        token: undefined as string | undefined,
        user: undefined as any | undefined,
    }

    const err = {
        error: false,
        errorCode: undefined as any,
        errorMessage: undefined as any,
        email: undefined as any,
        credential: null as OAuthCredential | null,
    }

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            res.credential = GoogleAuthProvider.credentialFromResult(result);
            res.token = res.credential?.accessToken;
            // The signed-in user info.
            res.user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            err.error = true
            // Handle Errors here.
            err.errorCode = error.code;
            err.errorMessage = error.message;
            // The email of the user's account used.
            err.email = error.customData.email;
            // The AuthCredential type that was used.
            err.credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

    return { res, err }
}