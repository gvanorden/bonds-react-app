import React, { Component } from 'react';
import { isMobile } from "react-device-detect";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './index';
import Instruction from './instructions';
//import BondPricingOne from './bond_pricing_individual';
import BondPricingTwo from './bond_pricing_spreadsheet';
import IndividualBonds from './pricing/individual';
import logo from '../images/bond-logo.png';
import "../styles/nav.css"

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: window.location.pathname,
            windowWidth: window.outerWindow,
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
        else if (isMobile) {
            return name + '-tablet'
        }
        else {
            return name
        }
    }


    render() {
        const { setClass } = this

        return (
            <BrowserRouter>
                <Navbar className={this.state.currentPage === '/' ? 'nav-background-home' : 'nav-background'}>
                    <Navbar.Brand className={setClass('brand')}>
                        <img
                            src={logo}
                            alt="SAVINGS BOND PRICING TOOL"
                            className={setClass('brand-img')}
                        /></Navbar.Brand>
                    <Nav.Link className={setClass('bond-nav-link')} href="/">HOME</Nav.Link>
                    <Nav.Link className={setClass('bond-nav-link')} href="/instructions">INSTRUCTIONS</Nav.Link>
                    <NavDropdown className={setClass('bond-nav-link')} title="BOND PRICING">
                        <NavDropdown.Item href='/pricing/individual' style={{ fontSize: '.85rem' }}>INDIVIDUAL</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/bond_pricing_spreadsheet" style={{ fontSize: '.85rem' }}>SPREADSHEET</NavDropdown.Item>
                    </NavDropdown>
                </Navbar>
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/instructions' component={Instruction} />
                    <Route exact path='/pricing/individual' component={IndividualBonds} />
                    {/*<Route exact path='/bond_pricing_individual' component={BondPricingOne} />*/}
                    <Route exact path='/bond_pricing_spreadsheet' component={BondPricingTwo} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Navigation;