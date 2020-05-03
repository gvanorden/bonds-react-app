import React, { Component } from 'react';
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
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);

        if (window.outerWidth > 0 && window.outerHeight > 0) {
            this.setState({ windowWidth: window.outerWidth, windowHeight: window.outerHeight })
        }
        else {
            this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
        }
    }

    handleResize() {
        setTimeout(() => {
            if (window.outerWidth > 0 && window.outerHeight > 0) {
                this.setState({ windowWidth: window.outerWidth, windowHeight: window.outerHeight })
            }
            else {
                this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
            }
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

    render() {
        const { setClass } = this
        const exportData = [['Serial Number [optional]', 'Series [I, E, EE, S]', 'Denomination [25 - 10000 (no commas)]', 'Issue Date [Mo/Yr]']]

        return (
            <div>
                <div className={setClass('instruct-container')}>
                    <div className={setClass('bond-anatomy')}>
                        <Image width='100%' src={Bond} alt="Savings Bond Anatomy"></Image>
                    </div>
                    <div className="steps">
                        {this.state.windowWidth < 500 ?
                            <React.Fragment>
                                <Row>
                                    <h5 style={{ marginBottom: '1rem' }}>STEP 1</h5>
                                </Row>
                                <Row>
                                    <p style={{ marginBottom: '0' }}>
                                        To build a spreadsheet of your bonds, start by downloading the <CSVLink filename="bond_import_template.csv" data={exportData}>CSV Template</CSVLink>
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
                                        To build a spreadsheet of your bonds, start by downloading the <CSVLink filename="bond_import_template.csv" data={exportData}>CSV Template</CSVLink>
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
                                    <p>Open up the CSV Template in Microsoft Excel or similar application. Following the directives in each column, insert a new row for each bond.</p>
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
                                    <p>Open up the CSV Template in Microsoft Excel or similar application. Following the directives in each column, insert a new row for each bond.</p>
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