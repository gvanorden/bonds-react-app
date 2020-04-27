import React, { Component } from 'react';
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
        };
    }

    render() {
        return (
            <BrowserRouter>
                <Navbar style={{ position: 'absolute' }}>
                    <Navbar.Brand>
                        <img
                            src={logo}
                            width="35"
                            height="35"
                            alt="SAVINGS BOND PRICING TOOL"
                        /></Navbar.Brand>
                    <Nav.Link href="/" style={{ fontSize: '14px', fontWeight: 'bold' }}>HOME</Nav.Link>
                    <Nav.Link href="/instructions" style={{ fontSize: '14px', fontWeight: 'bold' }}>INSTRUCTIONS</Nav.Link>
                    {/*<Nav.Link href="/bond_example" style={{ fontSize: '14px', fontWeight: 'bold' }}>BOND EXAMPLE</Nav.Link>*/}
                    <NavDropdown title="BOND PRICING" id="basic-nav-dropdown" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        <NavDropdown.Item href="/bond_pricing_individual" style={{ fontSize: '14px', color: '#2a3132' }}>INDIVIDUAL</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/bond_pricing_spreadsheet" style={{ fontSize: '14px', color: '#2a3132' }}>SPREADSHEET</NavDropdown.Item>
                    </NavDropdown>
                </Navbar>
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/instructions' component={Instruction} />
                    {/*<Route exact path='/bond_example' component={BondExample} />*/}
                    <Route exact path='/bond_pricing_individual' component={BondPricingOne} />
                    <Route exact path='/bond_pricing_spreadsheet' component={BondPricingTwo} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Navigation;