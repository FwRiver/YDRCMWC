import React, { useState } from 'react'
import { Nav, Form, Navbar, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function HeadNav() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to Logout')
        }
    }

    return (
        <Navbar expand="xl" bg="light" variant="light">
            <Navbar.Brand href="/">YDRC MWRP</Navbar.Brand>
            <Nav className="mr-auto">
            </Nav>
            <Form inline>
                <Button onClick={handleLogout} variant="outline-dark">
                Log Out
                </Button>
            </Form>
        </Navbar>
    )
}
