import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { db } from '../firebase'


export default function DeleteRecord() {
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        
        async function deleteRecord() {
            try {
                await db.collection('records').doc(location.id).delete()
                history.push('/')
            } catch (e) {
                console.log(e)
            }
            
        }

        deleteRecord()

    }, [])

    return (
        <div>
            
        </div>
    )
}
