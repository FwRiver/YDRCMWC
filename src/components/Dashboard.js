/*
 * Last Updated: 2021-05-23
 * Last Updated By: 寒
 * 
 */


import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

import { db } from '../firebase'
import firebase from 'firebase'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

// Components
import HeadNav from './HeadNav'

export default function Dashboard() {
    const updateRef = db.collection('config').doc('update_status')

    const history = useHistory()
    // const { currentUser } = useAuth()
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const [records, setRecords] = useState([])
    const [user, setUser] = useState({})
    const [showUpdate, setUpdateShow] = useState(false)
    const [updateInfo, setUpdateInfo] = useState({
        added: [],
        changed: []
    })

    let words = 0
    let total_words = 0

    const [show, setShow] = useState(false);
    const handleClose = () => setUpdateShow(false);
    const handleShow = () => setUpdateShow(true);

    useEffect(() => {

        // get thios user's info
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

        // Get this user's records
        async function getRecords() {
            await db.collection('records').where('email', '==', currentUser.email).orderBy("end_date","desc").get().then(res => {
                let rec = []
                if(!res.empty) {
                    res.forEach(item => {
                        let record = item.data()
                        record._id = item.id
                        rec.push(record)
                    })
                    setRecords(rec)
                    // console.log(records)
                }
            }).catch(err => console.log(err))
        }

        // Get Update Information
        async function getUpdateInfo() {
            let updateInfo = (await updateRef.get()).data()
            // console.log(updateInfo.added)
            
            if (updateInfo.has_new_update) {
                // console.log(currentUser.email)
                // console.log("INFO: " + !((updateInfo.users_updated).includes(currentUser.email)))
                if ( !((updateInfo.users_updated).includes(currentUser.email)) ) {
                    handleShow()
                }
            }

            setUpdateInfo(updateInfo)
        }

        getUser()
        getRecords()
        getUpdateInfo()
    
    }, [])

    let currentGoal = getCurrentGoal(user.reading_level)

    // Functions
    async function deleteRecord(id) {
        try {
            await db.collection('records').doc(id).delete()
            history.push('/')
        } catch (e) {
            console.log(e)
        }
        
    }

    

    let current = new Date()
    // console.log(records)
    records.forEach((item) => {
        let created = new Date(item.end_date)

        total_words += item.book_word_count
        // console.log(item.book_word_count + " Current: "+ current.getMonth() + ":" + current.getFullYear())
        // console.log(item.book_word_count + " Created: "+ created.getMonth() + ":" + created.getFullYear())
        // console.log(created.getUTCMonth())
        if ( (created.getUTCMonth() === current.getUTCMonth()) && (created.getUTCFullYear() === current.getUTCFullYear()) )
            words += item.book_word_count
    })

    return (
        <div>
            <HeadNav>        
            </HeadNav>
            <h3 style={{margin: '10px 0px 0px 0px'}}>Welcome! {user.child_first_name}</h3>
            <p style={{fontSize: '18px'}}>
                Your current reading class level: {user.reading_level}
                <br />
                
            </p>
            <p></p>
            <Link to="/new-record" className="btn btn-primary" style={{margin: '10px 10px 10px 0px'}}>New Record</Link>
            <label style={{color: 'gray'}}>Total Word Count: {total_words} | Current Monthly Progress: {words}/{currentGoal} ({((words/currentGoal)*100).toFixed(2) + "%"})</label>
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td width="35%">Book Name</td>
                        <td>Total Word Count</td>
                        <td>ATOS Book Level</td>
                        <td>Start Date</td>
                        <td>End Date</td>
                        <td>Minutes Read</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                {records.map((item, index) =>
                    <tr key={index}>
                        <td>{item.book_name}</td>
                        <td>{item.book_word_count}</td>
                        <td>{item.book_ar_level}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date}</td>
                        <td>{item.total_reading_minute}</td>
                        <td>
                        <Link to={
                            {     
                                pathname: '/edit-record',
                                id: item._id
                            }
                         }>
                             <FontAwesomeIcon style={{margin: '5px'}} icon={faEdit} />
                         </Link>
                         <Link to={
                            {     
                                pathname: '/delete-record',
                                id: item._id
                            }
                         }>
                             <FontAwesomeIcon style={{margin: '5px'}} icon={faTrash} color="red"/>
                         </Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
            {/* <Button variant="primary" onClick={getAllPassed}>Get</Button> */}

            <Modal show={showUpdate} onHide={handleClose}>
                <Modal.Header>
                <Modal.Title>New Update Avaliable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Version {updateInfo.version}</b>
                    <br />

                    {/* ADDED LIST */}
                    <b>[+] Added</b>
                    <br />
                    <ul >
                    {                        
                        updateInfo.added.map((item) => 
                            <li>{item}</li>
                        )                       
                    }
                    </ul>

                    {/* CHANGED LIST */}
                    <b>[-] Changed</b>
                    <br />
                    <ul >
                    {                        
                        updateInfo.changed.map((item, key) => 
                            <li>{item}</li>
                        )                       
                    }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={updateUser}>
                        Update Now
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )   

    async function updateUser() {
        let userDetails = user
        userDetails.reading_balance = 0
        userDetails.balance_details = []
        await db.collection('users').doc(user._id).update(userDetails)
        await updateRef.update({
            users_updated: firebase.firestore.FieldValue.arrayUnion(currentUser.email)
        })
        handleClose()
    }

    // 备用函数
    // async function getAllPassed() {
    //     console.log("Processing...")
    //     let passed = []
    //     // console.log(users)
    //     users.forEach(async(item) => {
    //         // console.log(item)
    //         await db.collection('records').where("email", "==", item.email).get().then(res => {
    //             // console.log(res)
    //             let total = 0
    //             if (!res.empty) {
    //                 res.forEach(item => {
    //                     let rec = item.data()
    //                     total += parseInt(rec.book_word_count)
                        
    //                 })
    //             }              
                
    //             item.total = total
    //             if (total >= 120000) {
    //                 passed.push(item)
    //                 console.log(item.group + "-" + item.group_num + " " + item.child_first_name + " " + item.child_last_name + " | " + total)
    //             }
    //         }).catch(err => console.log(err))
    //     })

    //     console.log(passed)
    //     passed.forEach(item => {
    //         console.log(item)
    //     })
    // }
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

function getCurrentGoal(level) {
    // check if starts with certain level
    switch(true) {
        case /^K/.test(level):
        case /^G1/.test(level):
            return 80000
        case /^G2/.test(level):
        case /^G3/.test(level):
            return 160000
        case /^G4/.test(level):
        case /^G5/.test(level):
            return 250000
        case /^G6/.test(level):
        case /^G7/.test(level):
        case /^G8/.test(level):
            return 250000
        default:
            return 1000000
    }
}

