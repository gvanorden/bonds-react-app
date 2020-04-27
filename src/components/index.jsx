import React, { Component } from 'react';
import { Jumbotron, ListGroup, Card, Table } from 'react-bootstrap';
import TDirectLogo from '../images/treasury-direct.png';
import '../index.css'

class HomePage extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <Jumbotron className='roboto' style={{ color: '#343a40' }}>
                    <h1 style={{ fontSize: '2em' }}>Quickly and easily price your savings bonds!</h1>
                    <h1 style={{ fontSize: '1em' }}>VALUE, AGGREGATE, and EXPORT any set of I, E, EE Series Bonds or Savings Notes.</h1>
                    <div style={{ marginTop: '3rem' }}>
                        <p style={{ marginBottom: '.5rem', marginLeft: '3em' }}>Choose an option:</p>
                        <ListGroup style={{ width: '25%', marginLeft: '3em' }}>
                            <ListGroup.Item><a style={{ color: '#ff420e', fontWeight: '500' }} href="/bond_pricing_individual">Price bonds individually</a></ListGroup.Item>
                            <ListGroup.Item><a style={{ color: '#ff420e', fontWeight: '500' }} href="/bond_pricing_spreadsheet">Price bonds from spreadsheet</a></ListGroup.Item>
                        </ListGroup>
                    </div>
                </Jumbotron>
                <Card style={{ float: 'left', width: '47%', marginLeft: '2%' }}>
                    <Card.Header style={{ background: 'rgba(0,0,0,.02)', fontSize: '1.25em', fontWeight: 'normal' }}>HOW WE DO IT</Card.Header>
                    <Card.Body style={{ textAlign: 'justify', paddingBottom: '.8em' }}>
                        <p>The <a target="_blank" rel="noopener noreferrer" href="https://www.treasurydirect.gov"><img style={{ width: '7.5em', marginRight: '.5em' }} src={TDirectLogo} alt="Treasury Direct" /></a>
                        provides historical <a href="https://www.treasurydirect.gov/indiv/tools/tools_savingsbondvalues_historical.htm">value files</a> that cover every issued I, E/EE Series bonds and/or Savings Notes.
                        We use a database built from these source files to evaluate the price of your bond(s).
                        </p>
                        <ul>
                            <li>100% accurate results</li>
                            <li>View redemption value data between May 1992 and May 2020</li>
                        </ul>
                    </Card.Body>
                </Card>
                <Card style={{ float: 'left', width: '47%', marginLeft: '2%' }}>
                    <Card.Header style={{ background: 'rgba(0,0,0,.02)', fontSize: '1.25em', fontWeight: 'normal' }}>WHAT YOU'LL NEED</Card.Header>
                    <Card.Body style={{ textAlign: 'justify' }}>
                        <div style={{ float: 'left', width: '100%' }}>
                            <div style={{ float: 'left', width: '65%' }}>
                                <p style={{ fontWeight: '500', marginBottom: '.25em' }}>MANDATORY</p>
                                <ListGroup style={{ marginLeft: '1em' }} horizontal>
                                    <ListGroup.Item className="wyn-list-item">
                                        <p className="wyn-seperator">&#8250;</p><p className="wyn-text">&nbsp;Series</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="wyn-list-item" style={{ marginLeft: '1em' }}>
                                        <p className="wyn-seperator">&#8250;</p><p className="wyn-text">&nbsp;Denomination</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="wyn-list-item" style={{ marginLeft: '1em' }}>
                                        <p className="wyn-seperator">&#8250;</p><p className="wyn-text">&nbsp;Issue Date</p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                            <div style={{ float: 'left', width: '30%', marginLeft: '5%' }}>
                                <p style={{ fontWeight: '500', marginBottom: '.25em' }}>OPTIONAL</p>
                                <ListGroup style={{ marginLeft: '1em' }} >
                                    <ListGroup.Item className="wyn-list-item">
                                        <p className="wyn-seperator">&#8250;</p><p className="wyn-text">&nbsp;Serial Number</p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                        </div>
                        <div style={{ float: 'left', width: '100%', marginTop: '1em' }}>
                            <p style={{ fontWeight: '500', marginBottom: '.25em' }}>FOR ASSISTANCE</p>
                            <Table style={{ marginBottom: '0', width: 'auto', marginLeft: '1em' }}>
                                <tr>
                                    <td style={{ border: 'none', padding: '0' }}>Building a spreadsheet for import:</td>
                                    <td style={{ border: 'none', padding: '0', paddingLeft: '1em' }}><a href="./instructions">Instructions</a></td>
                                </tr>
                                <tr>
                                    <td style={{ border: 'none', padding: '0' }}>Locating these bond components:</td>
                                    <td style={{ border: 'none', padding: '0', paddingLeft: '1em' }}><a href="./instructions">Bond Anatomy</a></td>
                                </tr>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment >
        )
    }
}

export default HomePage;