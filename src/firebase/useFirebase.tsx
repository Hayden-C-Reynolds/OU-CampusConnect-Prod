import React from "react"
import { 
    getAuth, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult,
    OAuthProvider
} from "firebase/auth";
import { app } from "./config";
import { User } from "../types/user"
import { IonStorageContext } from "../contexts/StorageContext";

const useFirebase = () => {

    const auth = getAuth(app);
    const [user, setUser] = React?.useState<User | any>(null);
    const { handleOnCreateNewEntry } = React?.useContext(IonStorageContext);
    const microsoftProvider = new OAuthProvider('microsoft.com');
    microsoftProvider.addScope('user.read');
    microsoftProvider.addScope('mail.read');

    microsoftProvider.setCustomParameters({
        tenant: 'common' // Usar 'common' para cuentas personales y organizacionales
        // tenant: 'tu-tenant-id' // Para un tenant específico
    });

    // FUNCTIONS
    const handleOnLogin = async ( credentials: any) => {
        try {
            const data = await signInWithEmailAndPassword(auth, credentials["email"], credentials["id"]);
            // Usuario autenticado
            if(data?.user !== null && data !== null)
            {
                // App.tsx's guard effect handles navigation once userData
                // goes non-null — pushing here too raced it and left the
                // URL and the visible page out of sync.
                await handleOnCreateNewEntry("user", {
                    id: credentials["id"],
                    fullName: data?.user["displayName"],
                    email: credentials["email"],
                    profilePic: data?.user["photoURL"]
                })
                return;
            }

            return false
        } catch (err: any) {
            return false;
        }
    }

    const handleOnLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            console.log("entro al redirect")
            await signInWithRedirect(auth, provider);
            console.log("despu[es del redirect...")
        } catch (error) {
            console.error("Error en login con Google:", error);
            return null;
        }
    };

    const handleOnLoginWithGooglePopUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
        const result = await signInWithPopup(auth, provider);
            // App.tsx's guard effect handles navigation once userData
            // goes non-null — pushing here too raced it and left the URL
            // and the visible page out of sync.
            await handleOnCreateNewEntry("user", {
                    id: result?.user["uid"],
                    fullName: result?.user["displayName"],
                    email: result?.user["email"],
                    profilePic: result?.user["photoURL"]
                })
        return user;
        } catch (error) {
        console.error("Error en login con Google popup:", error);
        return null;
        }
    }

    const handleOnLoginWithMicrosoftPopUp = async () => {
        try {
            const result = await signInWithPopup(auth, microsoftProvider);
            
            // Información del usuario
            const user = result.user;
            
            // Token de acceso de Microsoft (para usar con Microsoft Graph)
            const credential: any = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            
            console.log('Usuario autenticado:', user);
            console.log('Access Token:', accessToken);
            
            return { user, accessToken };
        } catch (error) {
            console.error('Error en autenticación:', error);
            throw error;
        }
    }

    const handleOnLoginAsGuest = async () => {
        await handleOnCreateNewEntry("user", {
            id: "G000001",
            fullName: "GUEST USER",
            email: null,
            profilePic: null,
        })
    }

    const handleAnswerOnRedirect = async () => {
        
        await getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        setUser(result?.user)
                        alert(`Usuario autenticado ${user}`);
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener resultado de redirección', error);
                });
    }

    return {
        handleOnLogin,
        handleOnLoginWithGooglePopUp,
        handleOnLoginWithMicrosoftPopUp,
        handleOnLoginAsGuest,
        handleAnswerOnRedirect,
        auth
    }
}

export default useFirebase;