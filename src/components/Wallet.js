import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'

import { db } from '../firebase'
//Components
import HeadNav from './HeadNav'

export default function Wallet() {
    const [user, setUser] = useState({
        balance_details: [],
        reading_balance: 0
    })

    const currentUser = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        // get user's info
        async function getUser() {
            await db.collection('users').where('email', '==', currentUser.email).get().then(res => {
                let info
                if (!res.empty) {
                    info = res.docs[0].data()
                    info._id = res.docs[0].id
                    // console.log(info)
                    setUser(info)
                }  
            }).catch(err => console.log(err))
        }

        getUser()
    
    }, [])

    console.log(user.balance_details)

    return (
        <div>
            <HeadNav>
            </HeadNav>
            <h3 style={{margin: '10px 0px 0px 0px'}}>Reading Wallet of {user.child_first_name}</h3>
            <p style={{fontSize: '18px'}}>
                Your current reading balance: ${(user.reading_balance).toFixed(2)}
            </p>
            <p></p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td width="20%">Date</td>
                        <td width="40%">Description</td>
                        <td width="25%">Deposit/Withdrawal Amount</td>
                        <td width="15%">Balance</td>
                    </tr>
                </thead>
                <tbody>
                {user.balance_details.map((item, index) =>
                    <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.description}</td>
                        {processAmount(item)}
                        <td>${(item.balance).toFixed(2)}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    )

    // Functions
    function processAmount(record) {
        console.log(record)
        switch(record.type) {
            case "depo":
                return <td class="text-success">+{(record.amount).toFixed(2)}</td>
            case "with":
                return <td class="text-danger">- {(record.amount).toFixed(2)}</td>
            default:
                return null
        }
    }
}
