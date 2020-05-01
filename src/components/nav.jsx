import React, { Component } from 'react';
import { isMobile } from "react-device-detect";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './index';
import Instruction from './instructions';
import BondPricingOne from './bond_pricing_individual';
import BondPricingTwo from './bond_pricing_spreadsheet';
//import BondExample from './bond_example';
import logo from '../images/bond-logo.png';
import '../index.css'

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.outerWindow,
            windowHeight: window.outerHeight
        };

        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    handleResize() {
        setTimeout(() => {
            this.setState({ windowWidth: window.outerWidth, windowHeight: window.outerHeight })
        }, 100);
    }

    render() {
        const { windowWidth, windowHeight } = this.state

        return (
            <BrowserRouter style={{ width: '100%', maxWidth: windowWidth }}>
                <Navbar style={{ position: 'absolute' }}>
                    <Navbar.Brand style={isMobile && windowHeight < 500 ? { marginRight: '.25rem', marginTop: '-.25rem' } : { marginRight: '.25rem' }}>
                        <img
                            src={logo}
                            width={isMobile && windowHeight < 500 ? "20" : "35"}
                            height={isMobile && windowHeight < 500 ? "20" : "35"}
                            alt="SAVINGS BOND PRICING TOOL"
                        /></Navbar.Brand>
                    <Nav.Link className={isMobile && windowWidth < 550 ? 'mobile-link' : null} href="/" style={{ fontSize: '.75em', fontWeight: 'bold' }}>HOME</Nav.Link>
                    <Nav.Link className={isMobile && windowWidth < 550 ? 'mobile-link' : null} href="/instructions" style={{ fontSize: '.75rem', fontWeight: 'bold' }}>INSTRUCTIONS</Nav.Link>
                    {isMobile && windowWidth < 550 ?
                        <NavDropdown className='mobile-dropdown' title="BOND PRICING" style={{ fontSize: '.65rem', fontWeight: 'bold' }} alignRight>
                            <NavDropdown.Item href="/bond_pricing_individual" style={{ fontSize: '.75rem', color: '#2a3132' }}>INDIVIDUAL</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/bond_pricing_spreadsheet" style={{ fontSize: '.75rem', color: '#2a3132' }}>SPREADSHEET</NavDropdown.Item>
                        </NavDropdown> :
                        <NavDropdown title="BOND PRICING" style={{ fontSize: '.75rem', fontWeight: 'bold' }}>
                            <NavDropdown.Item href="/bond_pricing_individual" style={{ fontSize: '.75rem', color: '#2a3132' }}>INDIVIDUAL</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/bond_pricing_spreadsheet" style={{ fontSize: '.75rem', color: '#2a3132' }}>SPREADSHEET</NavDropdown.Item>
                        </NavDropdown>}
                </Navbar>
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/instructions' component={Instruction} />
                    <Route exact path='/bond_pricing_individual' component={BondPricingOne} />
                    <Route exact path='/bond_pricing_spreadsheet' component={BondPricingTwo} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Navigation;