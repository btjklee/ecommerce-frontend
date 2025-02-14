import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Navbar, Nav, Row, Col } from "react-bootstrap";

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("https://ecommerce-site-l9ti.onrender.com/products")  // API URL
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#">My E-Commerce Site</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link href="#">Home</Nav.Link>
                        <Nav.Link href="#">Shop</Nav.Link>
                        <Nav.Link href="#">Cart</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Product Display */}
            <Container className="mt-4">
                <h1 className="text-center">Welcome to My E-Commerce Site</h1>
                <h2 className="text-center mb-4">Products</h2>
                <Row>
                    {products.map(product => (
                        <Col md={4} key={product.id} className="mb-4">
                            <Card className="shadow">
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>
                                        {product.description}
                                    </Card.Text>
                                    <h4>${product.price}</h4>
                                    <Button variant="primary">Buy Now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default App;
