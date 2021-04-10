import React from 'react'

import { Container } from 'react-bootstrap'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Components
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import ForgotPassword from './components/ForgotPassword'
import UpdateProfile from './components/UpdateProfile'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import NewRecord from './components/NewRecord'
import EditRecord from './components/EditRecord'
import DeleteRecord from './components/DeleteRecord'

function App() {
  return (
    <Container style={{ minHeight: '100vh' }}>
      <div className="w-100">
        <Router>
          <AuthProvider>
            <Switch> 
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />

              <PrivateRoute path="/new-record" component={NewRecord} />
              <PrivateRoute path="/edit-record" component={EditRecord} />
              <PrivateRoute path="/delete-record" component={DeleteRecord} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
