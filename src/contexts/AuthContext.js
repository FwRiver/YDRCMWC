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
        const data = {
            address: profile.address,
            address_city: profile.city,
            address_state: profile.state,
            address_zipcode: profile.zip,
            child_birthdate: profile.child_birthdate,
            child_first_name: profile.child_first_name,
            child_last_name: profile.child_last_name,
            current_grade: profile.grade,
            email: profile.email,
            group: profile.group,
            group_num: profile.group_num,
            parent_wechat: profile.parent_wechat,
            reading_level: profile.reading_level
        }

        try {
            let res = await userRef.add(data)

            if (res) {
                return await auth.createUserWithEmailAndPassword(email, password)
            }
        }catch (e) {
            console.log(e)
        }

        
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

    async function updateRecord(record) {
        console.log(record)
        return await db.collection('records').doc(record.id).update(record)
    }

    async function newRecord(record) {
        // console.log(record)
        const recordRef = db.collection('records')
        return await recordRef.add(record)
    }
    
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                setLoading(true)
                localStorage.setItem('user', JSON.stringify(user))
                setCurrentUser(user)
            }
            else {
                localStorage.removeItem('user')
            }
            setLoading(false)
        })
    }, [])    

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        updateRecord,
        newRecord
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

// Functions