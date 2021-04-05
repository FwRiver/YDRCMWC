import React, { useContext, useState, useEffect } from "react"
import { auth, db } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(false)
    const userRef = db.collection('users')

    async function signup(email, password, profile) {
        auth.createUserWithEmailAndPassword(email, password)

        const data = {
            address: profile.address,
            address_city: profile.city,
            address_state: profile.state,
            address_zipcode: profile.zip,
            child_birthdate: profile.child_birthdate,
            child_first_name: profile.child_first_name,
            child_last_name: profile.child_last_name,
            current_grade: profile.grade,
            email: currentUser.email,
            group: profile.group,
            group_num: profile.group_num,
            parent_wechat: profile.parent_wechat,
            reading_level: profile.reading_level
        }

        let res = await userRef.add(data)
        console.log(data)
        return res
    }

    async function login(email, password) {
        const userRef = db.collection('users')
        
        let res = await userRef.get({
            email: email
        })

        if (res) return await auth.signInWithEmailAndPassword(email, password)
        else return
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    async function updateProfile(nprofile) {
        
    }

    async function newRecord(record) {
        console.log(record)
        const recordRef = db.collection('records')
        return await recordRef.add(record)
    }
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
    
        return unsubscribe
    }, [])    

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        updateProfile,
        newRecord
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

// Functions