import { useState } from "react"
import { Modal, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDoc } from 'firebase/firestore'
import { useAuth } from "./useAuth";

const MenuItemEditor = (props) =>  {
    const auth = useAuth()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('0.00')
    const [category, setCategory] = useState('')

    const uploadMenuItem = async (uid, name, description, price, category) => {
        let restaurantId
        let userRef = firebase.firestore().collection('users').doc(uid)
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
        let newMenuItem = firebase.firestore().collection('restaurants').doc(restaurantId).collection('menu').doc()
        newMenuItem.set({
            name: name,
            description: description,
            price: parseFloat(price),
            category: category,
            totalLikes: 0,
            totalTags: 0
        }).then(() => {
            let newItem = {name: name, description: description, price: parseFloat(price), category: category, totalLikes: 0, totalTags: 0}
            props.onSave(newItem)
            props.handleClose()
        })
    }
    
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formItemName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formItemDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formItemPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type="text" 
                                onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formItemCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control 
                                type="text" 
                                onChange={(e) => setCategory(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <Row style={{justifyContent: 'right'}}>
                        <Button
                            onClick={() => {
                                uploadMenuItem(auth.user, name, description, price, category)
                            }}
                        >
                            Save
                        </Button>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MenuItemEditor