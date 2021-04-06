import React, { useState, useEffect, queryOverview } from 'react'
import { Nav, Form, Navbar, Button, Table } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db } from '../firebase'

// Components
import HeadNav from './HeadNav'

export default function Dashboard() {
    const { currentUser, logout } = useAuth()
    const [records, setRecords] = useState([])
    const [user, setUser] = useState({})
    let words = 0

    useEffect(() => {
        async function getRecords() {
            await db.collection('records').where('email', '==', currentUser.email).get().then(res => {
                let rec = []
                if(!res.empty) {
                    res.forEach(item => {
                        rec.push(item.data())
                    })
                }
                setRecords(rec)
            }).catch(err => console.log(err))
        }

        async function getUser() {
            await db.collection('users').where('email', '==', currentUser.email).get().then(res => {
                let info
                if (!res.empty) {
                    info = res.docs[0].data()
                }
                setUser(info)
                console.log(user)
            }).catch(err => console.log(err))
        }
        getRecords()
        getUser()
        
    }, [])

    records.forEach((item) => {
        words += item.book_word_count
    })

    return (
        <div>
            <HeadNav>        
            </HeadNav>
            <h3 style={{margin: '10px 0px 0px 0px'}}>Welcome! {user.child_first_name}</h3>
            <p style={{fontSize: '18px'}}>Your current reading class level: {user.reading_level}</p>
            <Link to="/new-record" className="btn btn-primary" style={{margin: '10px 10px 10px 0px'}}>New Record</Link>
            <label style={{color: 'gray'}}>Total Word Count: {words} | Current Monthly Progress: {words}/120000 ({((words/120000)*100).toFixed(2) + "%"})</label>
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td width="40%">Book Name</td>
                        <td width="15%">Total Word Count</td>
                        <td width="10%">AR Level</td>
                        <td>Start Date</td>
                        <td>End Date</td>
                        <td width="12%">Hours Read</td>
                    </tr>
                </thead>
                <tbody>
                {records.map((item) =>
                    <tr>
                        <td>{item.book_name}</td>
                        <td>{item.book_word_count}</td>
                        <td>{item.book_ar_level}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date}</td>
                        <td>{item.total_reading_hour}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    )
}

//functions
function getTime(sec) {
    const ms = sec * 1000
    const dateObject = new Date(ms)
    const dateFormat = dateObject.toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      })
    return dateFormat
}