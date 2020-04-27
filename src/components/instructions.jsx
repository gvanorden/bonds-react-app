import React, { Component } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import csvExample from '../images/csv-example.png';

class Instructions extends Component {
    state = {}

    render() {
        const exportData = [['Serial Number', 'Series', 'Denomination', 'Issue Date [Mo/Yr]']]

        return (
            <React.Fragment>
                <div className="jumbotron-pages"></div>
                <div style={{ width: '70%', minWidth: '850px', margin: 'auto', marginTop: '2rem' }}>
                    <h5>PRICING BONDS BY SPREADSHEET</h5>
                    <div className="steps">
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
                    </div>
                    <div className="steps">
                        <Row>
                            <Col className="col-auto">
                                <h5 style={{ float: 'left' }}>STEP 2</h5>
                            </Col>
                            <Col>
                                <p>Open up the CSV Template in Microsoft Excel or similar application.</p>

                                <p>For each of your bonds, insert a new row into the spreadsheet.  I've provided two valid examples below:</p>
                                <div style={{ width: '85%', overflow: 'hidden' }} >
                                    <Image style={{ margin: '-3px 0 0 -2px' }} src={csvExample} alt="Savings bond wizard blank spreadsheet" rounded fluid></Image>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="steps">
                        <Row>
                            <Col className="col-auto">
                                <h5 style={{ float: 'left' }}>STEP 3</h5>
                            </Col>
                            <Col>
                                Import your CSV file using the ATTACHMENT field at the top of the BOND PRICING > <a href='./bond_pricing_spreadsheet'> SPREADSHEET</a> page.
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default Instructions;