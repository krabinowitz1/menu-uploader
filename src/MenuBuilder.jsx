import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Card, Stack } from 'react-bootstrap'
import MenuItem from './MenuItem'
import { useAuth } from './useAuth'
import { Redirect } from 'react-router'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDoc } from 'firebase/firestore'
import MenuItemEditor from './MenuItemEditor';
import 'bootstrap/dist/css/bootstrap.css'

const EmptyCards = (props) => {
    const numCards = (props.numItems + 1) % 4

    const emptyCardList = []

    for (var i = 0; i < numCards; i++) {
        emptyCardList.push(
            <Col sm={true}>
                <Container style={{width: '18rem'}}></Container>
            </Col>
        )
    }

    return (
        <>
            {emptyCardList.map(e => e)}
        </>
    )
    

}

const MenuBuilder = () => {
    const auth = useAuth()
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [show, setShow] = useState(false)

    const categoriesMap = useRef(new Map())

    useEffect(() => {
        console.log(auth.user)
        const fetchMenuItems = async (uid) => {
            let restaurantId
            let userRef = firebase.firestore().collection('users').doc(uid)
            let items = []
            let userDoc
            try {
                userDoc = await getDoc(userRef)
                restaurantId = userDoc.data().restaurantId
                console.log(restaurantId)
            }
            catch (error) {
                console.log(error)
                return
            }
            let snapshot
            try {
                snapshot = await firebase.firestore().collection('restaurants').doc(restaurantId).collection('menu').get()
            }
            catch (error) {
                console.log(error)
                return
            }
    
            snapshot.docs.forEach((doc) => {
                items.push(doc.data())
            })

            let categories = []
            for (var i = 0; i < items.length; i++) {
                let cat = items[i].category
                if (categoriesMap.current.get(cat) === undefined) {
                    categoriesMap.current.set(cat, 1)
                    categories.push(cat)
                }
                else {
                    categoriesMap.current.set(cat, categoriesMap.current.get(cat) + 1)
                }
                console.log(categoriesMap)
            }

            setItems(items)
            setCategories(categories)
        }
        if (auth.user) {
            fetchMenuItems(auth.user)
        }
        
    }, [])

    const addToList = (newItem) => {
        items.push(newItem)
        if (categoriesMap.current.get(newItem.category) === undefined) {
            categoriesMap.current.set(newItem.category, 1)
            categories.push(newItem.category)
        }
        else {
            categoriesMap.current.set(newItem.category, categoriesMap.current.get(newItem.category) + 1)
        }
        setItems([...items])
        setCategories([...categories])
    }

    if (!auth.user) {
        return (
            <Redirect
                to={{pathname: '/login'}}>

            </Redirect>
        )
    }

    return (
        <>
            <MenuItemEditor
                onSave={(newItem) => addToList(newItem)}
                handleClose={() => setShow(false)}
                handleShow={() => setShow(true)}
                show={show}
            >

            </MenuItemEditor>
            <Container>
                <Row style={{padding: 16, justifyContent: 'center'}}>
                    <Button 
                        style={{width: 124}}
                        onClick={() => auth.signout()}
                    >
                        Sign out
                    </Button>
                </Row>
                <Row style={{padding: 16, justifyContent: 'left'}}>
                    <h2>Categories</h2>
                </Row>
                <Row>
                    {categories.map(e => 
                        <Col sm={true}>
                            <div style={{paddingTop: 16}}>
                                <Card style={{width: '18rem'}}>
                                    <Card.Body>
                                        <Stack direction='horizontal'>
                                            <Card.Title>
                                                {e}
                                            </Card.Title>
                                            {console.log(categoriesMap)}
                                            <p style={{marginBottom: 8, marginLeft: 8}}>({categoriesMap.current.get(e)})</p>
                                        </Stack>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    )}
                    <EmptyCards numItems={items.length}></EmptyCards>
                </Row>
                <Row style={{marginTop: 16, padding: 16, justifyContent: 'left'}}>
                    <h2>Menu Items</h2>
                </Row>
                <Row>
                    {items.map(e => 
                        <Col sm={true}>
                            <div style={{paddingTop: 16}}>
                                <MenuItem 
                                    name={e.name}
                                    description={e.description}
                                    price={e.price}
                                    category={e.category}
                                ></MenuItem>
                            </div>
                        </Col>
                    )}
                    <Col sm={true}>
                        <div style={{paddingTop: 16}}>
                            <Card 
                                style={{width: '18rem'}}
                                onClick={() => setShow(true)}
                            >
                                <Card.Body>
                                    <Card.Title>
                                        {'Add New Item'}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                    <EmptyCards numItems={items.length}></EmptyCards>
                </Row>
            </Container>
        </>
    )
}

export default MenuBuilder