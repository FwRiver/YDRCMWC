import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert, Col } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Signup() {
    // References
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const groupRef = useRef()
    const groupNumRef = useRef()
    const parentWechatRef = useRef()
    const childFirstNameRef = useRef()
    const childLastNameRef = useRef()
    const birthdateRef = useRef()
    const currentGradeRef = useRef()
    const levelRef = useRef()
    const addressRef = useRef()
    const cityRef = useRef()
    const stateRef = useRef()
    const zipRef = useRef()

    // utils
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    // handle submit
    async function handleSubmit(e) {
        e.preventDefault()

        const profile = {
            address: addressRef.current.value,
            city: cityRef.current.value,
            state: stateRef.current.value,
            zip: zipRef.current.value,
            child_birthdate: birthdateRef.current.value,
            child_first_name: childFirstNameRef.current.value,
            child_last_name: childLastNameRef.current.value,
            grade: currentGradeRef.current.value,
            group: groupRef.current.value,
            group_num: groupNumRef.current.value,
            parent_wechat: parentWechatRef.current.value,
            reading_level: levelRef.current.value,
            email: emailRef.current.value
        }

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            
            console.log(profile)
            await signup(emailRef.current.value, passwordRef.current.value, profile)
            history.push('/')
        } catch {
            setError('Failed to create your account! Please try again later.')
        }

        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '400px', margin: '15% auto' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group id="email" as={Col} md="12">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="password" as={Col} md="12">
                                <Form.Label>Password (Length should be larger than 6)</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="password-confirm" as={Col} md="12">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="group" as={Col} md="6">
                                <Form.Label>YDRC WeChat Group</Form.Label>
                                <Form.Control type="text" ref={groupRef} required />
                            </Form.Group>
                            <Form.Group id="group_num" as={Col} md="6">
                                <Form.Label>YDRC WeChat Number</Form.Label>
                                <Form.Control type="number" ref={groupNumRef} required />
                            </Form.Group>
                        </Form.Row>
                        
                        <Form.Row>
                            <Form.Group id="parent_wechat" as={Col} md="12">
                                <Form.Label>Parent Wechat Name</Form.Label>
                                <Form.Control type="text" ref={parentWechatRef} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="child_first_name" as={Col} md="6">
                                <Form.Label>Child First Name</Form.Label>
                                <Form.Control type="text" ref={childFirstNameRef} required />
                            </Form.Group>   
                            <Form.Group id="child_last_name" as={Col} md="6">
                                <Form.Label>Child Last Name</Form.Label>
                                <Form.Control type="text" ref={childLastNameRef} required />
                            </Form.Group>   
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="birthdate" as={Col} md="12">
                                <Form.Label>Birthdate</Form.Label>
                                <Form.Control type="date" ref={birthdateRef} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group id="current_grade" as={Col} md="12">
                                <Form.Label>Current Grade</Form.Label>
                                <Form.Control as="select" ref={currentGradeRef} required>
                                    <option disabled>Choose Your Current Grade</option>
                                    <option value="K">K</option>
                                    <option value="G1">G1</option>
                                    <option value="G2">G2</option>
                                    <option value="G3">G3</option>
                                    <option value="G4">G4</option>
                                    <option value="G5">G5</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                         <Form.Row>
                            <Form.Group id="level" as={Col} md="12">
                                <Form.Label>Reading Class Level</Form.Label>
                                <Form.Control as="select" ref={levelRef} required>
                                    <option disabled>Choose Your Level Class...</option>
                                    <option value="K">K</option>
                                    <option value="G1">G1</option>
                                    <option value="G2">G2</option>
                                    <option value="G3-A">G3-A</option>
                                    <option value="G4-A">G4-A</option>
                                    <option value="G4-B">G4-B</option>
                                    <option value="G5">G5</option>
                                    <option value="G6">G6</option>
                                    <option value="G7">G7</option>
                                    <option value="G8">G8</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>   
                            
                        <Form.Row>
                            <Form.Group as={Col} md="12">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" ref={addressRef} required/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} md="6">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" ref={cityRef} required/>
                            </Form.Group>

                            <Form.Group as={Col} md="3">
                                <Form.Label>State</Form.Label>
                                <Form.Control type="text" placeholder="e.g. CA" ref={stateRef} required/>
                            </Form.Group>

                            <Form.Group as={Col} md="3">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control type="number" ref={zipRef} required/>
                            </Form.Group>
                        </Form.Row>

                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already registered? <Link to="/login">Log In</Link>
            </div>
        </div>
    )
}
