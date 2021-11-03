import { Row, Col, Stack } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

const MenuItem = (props) => {
    return (
        <Card 
            style={{width: '18rem'}}
        >
            <Card.Body>
                <Stack direction='horizontal' gap={2}>
                    <Card.Title>
                        {props.name}
                    </Card.Title>
                    <p style={{marginBottom: 8, color: '#808080'}}>${props.price}</p>
                </Stack>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Badge pill bg='secondary'>
                    {props.category}
                </Badge>
            </Card.Body>
        </Card>
    )
}

export default MenuItem