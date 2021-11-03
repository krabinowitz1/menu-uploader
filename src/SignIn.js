import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useAuth } from './useAuth'
import { Redirect } from 'react-router'
import { Stack } from 'react-bootstrap'

const SignIn = () => {
    const auth = useAuth()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    if (auth.user) {
        return (
            <Redirect
                to={{pathname: '/menu'}}>

            </Redirect>
        )
    }
    return (
        <>
        <Container>
            <Row style={{height:'100vh'}} className='align-items-center'>
                <Col>
                    <h4 style={{textAlign:'center'}}>Sign in</h4>
                    <Card style={{padding:16}}>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                        </Form>
                        <Row style={{justifyContent:'center'}}>
                            <Stack>
                            <Button 
                                style={{width: 128}}
                                onClick={() => auth.signin(email, password)}
                            >Sign in</Button>
                            <h4 style={{textAlign: 'center'}}>{auth.error ? auth.error : ''}</h4>
                            </Stack>
                            
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default SignIn