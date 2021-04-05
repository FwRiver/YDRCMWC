import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert, Col } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {
    const bookRef = useRef()
    const wordRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const hoursRef = useRef()
    const arlevelRef = useRef()

    const { currentUser, newRecord } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            let record = {
                book_name: bookRef.current.value,
                book_word_count: parseInt(wordRef.current.value),
                start_date: startDateRef.current.value,
                end_date: endDateRef.current.value,
                total_reading_hour: hoursRef.current.value,
                book_ar_level: parseFloat(arlevelRef.current.value),
                email: currentUser.email,
                created_at: Date.now()/1000
            }
            await newRecord(record)
            history.push('/')
        } catch {
            setError('Email or password incorrect')
        }

        setLoading(false)

    }

    return (
        <div style={{ maxWidth: '600px', margin: '15% auto' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">New Reading Record</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={ handleSubmit }>
                        <Form.Row>
                            <Form.Group id="book_name" as={Col} md="8">
                                <Form.Label>Book Name</Form.Label>
                                <Form.Control type="text" ref={bookRef} required />
                            </Form.Group>
                            <Form.Group id="word_count" as={Col} md="4">
                                <Form.Label>Word Count</Form.Label>
                                <Form.Control type="number" ref={wordRef} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="start_date" as={Col} md="4">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" ref={startDateRef} required />
                            </Form.Group>

                            <Form.Group id="end_date" as={Col} md="4">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" ref={endDateRef} required />
                            </Form.Group>

                            <Form.Group id="hours" as={Col} md="4">
                                <Form.Label>Hours readed</Form.Label>
                                <Form.Control type="number" ref={hoursRef} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="book_name" as={Col} md="12">
                                <Form.Label>AR Level</Form.Label>
                                <Form.Control type="text" ref={arlevelRef} required />
                            </Form.Group>
                        </Form.Row>
                        
                        <Button disabled={ loading } className="w-100" type="submit">
                            Add Record
                        </Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/">Cancel</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
