import React, { useRef, useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { db } from '../firebase'
import { Card, Form, Button, Alert, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function EditRecord() {
    const location = useLocation()
    const history = useHistory()
    // console.log(location)
    const { updateRecord } = useAuth()

    const [record, setRecord] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const bookRef = useRef()
    const wordRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const minuteRef = useRef()
    const arlevelRef = useRef()

    useEffect(() => {
        async function getRecord() {
            db.collection('records').doc(location.id).get().then(res => {
                if(res.exists) {
                    setRecord(res.data())
                }
            }).catch(err => console.log(err))
        }

        getRecord()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            let record = {
                id: location.id,
                book_name: bookRef.current.value,
                book_word_count: parseInt(wordRef.current.value),
                start_date: startDateRef.current.value,
                end_date: endDateRef.current.value,
                total_reading_minute: minuteRef.current.value,
                book_ar_level: parseFloat(arlevelRef.current.value)
            }
            await updateRecord(record)
            history.push('/')
        } catch (e) {
            console.log(e)
            setError('Failed to update your record')
        }

        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '600px', margin: '15% auto' }}>
             <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Record</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={ handleSubmit }>
                    <Form.Row>
                            <Form.Group id="book_name" as={Col} md="8">
                                <Form.Label>Book Name</Form.Label>
                                <Form.Control type="text" ref={bookRef} required defaultValue={record.book_name}/>
                            </Form.Group>
                            <Form.Group id="word_count" as={Col} md="4">
                                <Form.Label>Word Count</Form.Label>
                                <Form.Control type="number" ref={wordRef} required defaultValue={record.book_word_count}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="start_date" as={Col} md="4">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" ref={startDateRef} required defaultValue={record.start_date}/>
                            </Form.Group>

                            <Form.Group id="end_date" as={Col} md="4">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" ref={endDateRef} required defaultValue={record.end_date}/>
                            </Form.Group>

                            <Form.Group id="hours" as={Col} md="4">
                                <Form.Label>Minutes Read</Form.Label>
                                <Form.Control type="number" ref={minuteRef} required defaultValue={record.total_reading_minute}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="book_name" as={Col} md="12">
                                <Form.Label>AR Level</Form.Label>
                                <Form.Control type="text" ref={arlevelRef} required defaultValue={record.book_ar_level}/>
                            </Form.Group>
                        </Form.Row>
                        
                        <Button disabled={ loading } className="w-100" type="submit">
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Cancel</Link>
            </div>
        </div>
    )
}
