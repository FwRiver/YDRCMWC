import React from 'react'
import { Nav, Form, Navbar, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'

export default function HeadNav() {
    const { logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        try {
            await logout()
            history.push('/login')
        } catch {
            console.log('error')
        }
    }

    return (
        <Navbar expand="xl" bg="light" variant="light">
            <Navbar.Brand href="/">YDRC MWC</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/wallet" style={{color: '#007bff'}}>Wallet</Nav.Link>
            </Nav>
            <Form inline>
                <Button onClick={handleLogout} variant="outline-primary">
                Log Out
                </Button>
            </Form>
        </Navbar>
    )
}
