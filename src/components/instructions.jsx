import React, { Component } from 'react';
import { isMobile } from "react-device-detect";
import { Row, Col, Image } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import csvExample from '../images/csv-example.png';
import Bond from '../images/bond.png';
import '../styles/instructions.css'

class Instructions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.outerWidth,
            windowHeight: window.outerHeight
        };

        this.handleResize = this.handleResize.bind(this)
        this.setClass = this.setClass.bind(this)
        this.setBkgdSize = this.setBkgdSize.bind(this)
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

        if (windowWidth <= 450) {
            return name + '-mobile-sm'
        }
        else if (windowWidth <= 1024) {
            return name + '-mobile'
        }
        else if (windowWidth <= 1375) {
            return name + '-tablet'
        }
        else {
            return name
        }
    }

    setBkgdSize() {
        const { windowWidth } = this.state

        if (isMobile) {
            if (windowWidth < 350) {
                return { backgroundSize: '400%' }
            }
            if (windowWidth < 420) {
                return { backgroundSize: '325%' }
            }
            else if (windowWidth < 1024) {
                return { backgroundSize: '175%' }
            }
            else if (windowWidth < 1224) {
                return { backgroundSize: '150%' }
            }
            else {
                return { backgroundSize: '125%' }
            }
        }
        else {
            return { backgroundSize: '125%' }
        }
    }

    render() {
        const { setClass } = this
        const exportData = [['Serial Number', 'Series', 'Denomination', 'Issue Date [Mo/Yr]']]

        return (
            <div>
                <div className="jumbotron-pages"></div>
                <div className={setClass('instruct-container')}>
                    <h5 className={setClass('instruct-header')}>BOND ANATOMY</h5>
                    <div className={setClass('bond-anatomy')}>
                        <Image width='100%' src={Bond} alt="Savings Bond Anatomy"></Image>
                    </div>
                    <h5 className={setClass('instruct-header')}>PRICING BONDS BY SPREADSHEET</h5>
                    <div className="steps">
                        {this.state.windowWidth < 500 ?
                            <React.Fragment>
                                <Row>
                                    <h5 style={{ marginBottom: '1rem' }}>STEP 1</h5>
                                </Row>
                                <Row>
                                    <p style={{ marginBottom: '0' }}>
                                        Download the <CSVLink filename="bond_import_template.csv" data={exportData}>CSV Template</CSVLink>
                                    </p>
                                </Row>
                            </React.Fragment>
                            :
                            <Row>
                                <Col className="col-auto">
                                    <h5 style={{ float: 'left' }}>STEP 1</h5>
                                </Col>
                                <Col>
                                    <p style={{ marginBottom: '0' }}>
                                        Download the <CSVLink filename="bond_import_template.csv" data={exportData}>CSV Template</CSVLink>
                                    </p>
                                </Col>
                            </Row>
                        }
                    </div>
                    <div className="steps">
                        {this.state.windowWidth < 500 ?
                            <React.Fragment>
                                <Row>
                                    <h5 style={{ marginBottom: '1rem' }}>STEP 2</h5>
                                </Row>
                                <Row>
                                    <p>Open up the CSV Template in Microsoft Excel or similar application.</p>

                                    <p>For each of your bonds, insert a new row into the spreadsheet.</p>
                                    <p>Here are two valid examples:</p>
                                    <div style={{ width: '100%', overflow: 'hidden' }} >
                                        <Image style={{ margin: '-3px 0 0 -2px' }} src={csvExample} alt="Savings bond wizard blank spreadsheet" rounded fluid></Image>
                                    </div>
                                </Row>
                            </React.Fragment>
                            :
                            <Row>
                                <Col className="col-auto">
                                    <h5>STEP 2</h5>
                                </Col>
                                <Col>
                                    <p>Open up the CSV Template in Microsoft Excel or similar application.</p>

                                    <p>For each of your bonds, insert a new row into the spreadsheet.</p>
                                    <p>Here are two valid examples:</p>
                                    <div style={{ width: '85%', overflow: 'hidden' }} >
                                        <Image style={{ margin: '-3px 0 0 -2px' }} src={csvExample} alt="Savings bond wizard blank spreadsheet" rounded fluid></Image>
                                    </div>
                                </Col>
                            </Row>
                        }
                    </div>
                    <div className="steps">
                        {this.state.windowWidth < 500 ?
                            <React.Fragment>
                                <Row>
                                    <h5 style={{ marginBottom: '1rem' }}>STEP 1</h5>
                                </Row>
                                <Row>
                                    <p style={{ marginBottom: '0' }}>
                                        <p>Import your CSV file here:</p>
                                        <p><a href='./bond_pricing_spreadsheet'> BOND PRICING > SPREADSHEET</a></p>
                                    </p>
                                </Row>
                            </React.Fragment>
                            :
                            <Row>
                                <Col className="col-auto">
                                    <h5 style={{ float: 'left' }}>STEP 3</h5>
                                </Col>
                                <Col>
                                    <p style={{ marginBottom: '0' }}>
                                        Import your CSV file here: <a href='./bond_pricing_spreadsheet'> BOND PRICING > SPREADSHEET</a>
                                    </p>
                                </Col>
                            </Row>
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default Instructions;