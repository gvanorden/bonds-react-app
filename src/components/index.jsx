import React, { Component } from 'react';
import { Jumbotron, ListGroup, Card } from 'react-bootstrap';
import TDirectLogo from '../images/treasury-direct.png';
import '../styles/index.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.outerWidth,
            windowHeight: window.outerHeight
        };

        this.handleResize = this.handleResize.bind(this)
        this.setClass = this.setClass.bind(this)
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);

        this.setState({ windowHeight: window.outerHeight, windowWidth: window.outerWidth })
    }

    handleResize() {
        setTimeout(() => {
            this.setState({ windowWidth: window.outerWidth, windowHeight: window.outerHeight })
            console.log(this.state.windowWidth, this.state.windowHeight)
        }, 100);
    }

    setClass(name) {
        const { windowWidth } = this.state

        if (windowWidth < 450) {
            return name + '-mobile-sm'
        }
        else if (windowWidth < 1024) {
            return name + '-mobile'
        }
        else if (windowWidth < 1400) {
            return name + '-tablet'
        }
        else {
            return name
        }
    }

    render() {
        const { setClass } = this

        return (
            <div>
                <Jumbotron className={setClass('home-jumbotron')}>
                    <h1>Quickly and easily price your savings bonds!</h1>
                    <h2 style={{ fontSize: '1rem' }}>Value, Aggregate, and Export any set of I, E, EE Series Bonds or Savings Notes.</h2>
                    <div style={{ marginTop: '3rem' }}>
                        <p style={{ float: 'left' }}>Choose an option:</p>
                        <ListGroup className={setClass('home-choose-container')} >
                            <ListGroup.Item className={setClass('home-choose')}><a style={{ color: '#ff420e', fontWeight: '500' }} href="/bond_pricing_individual">Price bonds individually</a></ListGroup.Item>
                            <ListGroup.Item className={setClass('home-choose')}><a style={{ color: '#ff420e', fontWeight: '500' }} href="/bond_pricing_spreadsheet">Price bonds from spreadsheet</a></ListGroup.Item>
                        </ListGroup>
                    </div>
                </Jumbotron >
                <div className={setClass('home-container')}>
                    <Card className={setClass('home-card')}>
                        <Card.Header className={'home-card-header'}>HOW WE DO IT</Card.Header>
                        <Card.Body className={'home-card-body'}>
                            <p><a target="_blank" rel="noopener noreferrer" href="https://www.treasurydirect.gov"><img style={{ width: '7.5rem', marginRight: '.5rem' }} src={TDirectLogo} alt="Treasury Direct" /></a>
                        provides historical <a href="https://www.treasurydirect.gov/indiv/tools/tools_savingsbondvalues_historical.htm">value files</a> which contain pricing data for all issued I, E/EE Series bonds and/or Savings Notes.
                        We use a database built from these source files to evaluate the price of your bond(s).
                        </p>
                            <ul>
                                <li>100% accurate results</li>
                                <li>View pricing data between May 1992 and May 2020</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className={setClass('home-card')}>
                        <Card.Header className={'home-card-header'}>WHAT YOU'LL NEED</Card.Header>
                        <Card.Body className={'home-card-body'}>
                            <p style={{ marginBottom: '.5rem' }}>On your bond, you'll need to locate the following items:</p>
                            <p style={{ float: 'left', width: '50%', margin: '.5rem 0', fontWeight: '500' }}>MANDATORY</p>
                            <p style={{ float: 'left', width: '50%', margin: '.5rem 0', fontWeight: '500' }}>OPTIONAL</p>
                            <ListGroup style={{ float: 'left', width: '50%' }}>
                                <ListGroup.Item className={'home-list-item'}>&#8250; Denomination</ListGroup.Item>
                                <ListGroup.Item className={'home-list-item'}>&#8250; Issue Date</ListGroup.Item>
                                <ListGroup.Item className={'home-list-item'}>&#8250; Series</ListGroup.Item>
                            </ListGroup>
                            <ListGroup style={{ float: 'left', width: '50%' }}>
                                <ListGroup.Item className={'home-list-item'} >&#8250; Serial Number</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Card className={setClass('home-card')}>
                        <Card.Header className={'home-card-header'}>FOR ASSISTANCE</Card.Header>
                        <Card.Body className={'home-card-body'}>
                            <p style={{ marginBottom: '.5rem', textAlign: 'left' }}><a href="./instructions">Build a spreadsheet to import</a></p>
                            <p style={{ marginBottom: '.5rem', textAlign: 'left' }}><a href="./instructions">Locate mandatory components on your bond</a></p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }
}

export default HomePage;