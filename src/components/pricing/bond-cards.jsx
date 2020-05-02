import React, { Component } from 'react';
import { Form, Col, Card } from 'react-bootstrap';
import "../../styles/individual.css";

class BondCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCards: { visibility: 'hidden' },
        }
    }

    convertValues(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    render() {
        const { totalDate, totalDenomination, totalPrice, totalInterest, totalValue, windowHeight, setClass } = this.props

        return (
            <Form style={{ marginTop: '1rem' }}>
                <Form.Row>
                    <Col>
                        <Card>
                            <Card.Header className={setClass('card-header')}>VALUED AS OF</Card.Header>
                            <Card.Body className={setClass('card-body')} >
                                <Card.Title className={setClass('card-title')}>{totalDate}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header className={setClass('card-header')}>{windowHeight <= 320 ? 'T. FACE VALUE' : 'TOTAL FACE VALUE'}</Card.Header>
                            <Card.Body className={setClass('card-body')} >
                                <Card.Title className={setClass('card-title')}>${this.convertValues(totalDenomination)}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header className={setClass('card-header')}>TOTAL PRICE</Card.Header>
                            <Card.Body className={setClass('card-body')} >
                                <Card.Title className={setClass('card-title')} style={{ color: 'red' }} >${this.convertValues(parseFloat(totalPrice).toFixed(2))}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header className={setClass('card-header')}>{windowHeight <= 320 ? 'T. INTEREST' : 'TOTAL INTEREST'}</Card.Header>
                            <Card.Body className={setClass('card-body')}>
                                <Card.Title className={setClass('card-title')} style={{ color: '#ff8c00' }}>${this.convertValues(parseFloat(totalInterest).toFixed(2))}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header className={setClass('card-header')}>TOTAL VALUE</Card.Header>
                            <Card.Body className={setClass('card-body')}>
                                <Card.Title className={setClass('card-title')} style={{ color: 'green' }}>${this.convertValues(parseFloat(totalValue).toFixed(2))}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                </Form.Row>
            </Form >
        );
    }
}

export default BondCards;