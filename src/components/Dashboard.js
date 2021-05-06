import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db } from '../firebase'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

// Components
import HeadNav from './HeadNav'

export default function Dashboard() {
    const history = useHistory()
    // const { currentUser } = useAuth()
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const [records, setRecords] = useState([])
    // const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    let words = 0

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
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
                    console.log(records)
                }
            }).catch(err => console.log(err))
        }

        async function getUser() {
            await db.collection('users').where('email', '==', currentUser.email).get().then(res => {
                let info
                if (!res.empty) {
                    info = res.docs[0].data()
                    // console.log(info)
                    setUser(info)
                }  
            }).catch(err => console.log(err))
        }

        // async function getAllUser() {
        //     await db.collection('users').where("reading_level", "==", "G4-B").get().then(res => {
        //         let users = []
        //         if(!res.empty) {
        //             res.forEach(item => {
        //                 let user = item.data()
        //                 user._id = item.id
        //                 users.push(user)
        //                 console.log(user.group + '-' + user.group_num + " | " + user.child_first_name + " " + user.child_last_name )
        //             })
        //             setUsers(users)
        //             // console.log(users)
        //         }
        //     }).catch(err => console.log(err))
        // }

        getUser()
        getRecords()
        // getAllUser()
    
    }, [])

    records.forEach((item) => {
        let created = new Date(item.end_date)
        let current = new Date()
        if (created.getMonth() == current.getMonth() && created.getFullYear() == current.getFullYear())
            words += item.book_word_count
    })

    let currentGoal = getCurrentGoal(user.current_grade)

    // Functions
    async function deleteRecord(id) {
        try {
            await db.collection('records').doc(id).delete()
            history.push('/')
        } catch (e) {
            console.log(e)
        }
        
    }

    let that = this

    return (
        <div>
            <HeadNav>        
            </HeadNav>
            <h3 style={{margin: '10px 0px 0px 0px'}}>Welcome! {user.child_first_name}</h3>
            <p style={{fontSize: '18px'}}>
                Your current reading class level: {user.reading_level}
                {/* <br /> */}
                {/* Current Reading Balance: ${} */}
            </p>
            <p></p>
            <Link to="/new-record" className="btn btn-primary" style={{margin: '10px 10px 10px 0px'}}>New Record</Link>
            <label style={{color: 'gray'}}>Total Word Count: {words} | Current Monthly Progress: {words}/{currentGoal} ({((words/currentGoal)*100).toFixed(2) + "%"})</label>
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

            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this record? This act can't be cancelled</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    )

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

function getCurrentGoal(grade) {
    switch(grade) {
        case "K":
        case "G1":
        case "G2":
            return 80000
        case "G3":
        case "G4":
        case "G5":
            return 160000
        case "G6":
        case "G7":
        case "G8":
            return 250000
        default:
            return 160000

    }
}

