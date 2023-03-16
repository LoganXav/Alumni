import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"

export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => { 
    
    const [user, setUser] = useState({})
    
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
        prompt: 'select_account',
        auth_type: 'rerequest',
        persistence: 'none'
      });

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {                
        })
    }

    const logOut = () => {
        signOut(auth)        
    }

    // Stop listening for auth state changes when the component is unmounted
    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)          
            
        })
        return () => {
            unsuscribe ()     
        }
    }, [])



    return (
        <AuthContext.Provider value={{ signInWithGoogle, logOut, user }}>
            {children}
        </AuthContext.Provider>    
  );
};

export const UserAuth = () => {
    return useContext(AuthContext)
}


