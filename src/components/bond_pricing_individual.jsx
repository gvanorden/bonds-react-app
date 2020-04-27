import React, { Component } from 'react';
import { Form, Col, InputGroup, Button, OverlayTrigger, Tooltip, Table, Card, Pagination, Alert } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import '../index.css'

class BondPricingOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bonds: [],
            totalPrice: 0,
            totalInterest: 0,
            totalValue: 0,
            totalDenomination: 0,
            totalDate: this.formatDate(this.getCurrentMonth() + '/' + this.getCurrentYear()),
            month: this.getCurrentMonth(),
            year: this.getCurrentYear(),
            updateDate: this.getCurrentMonth() + '/' + this.getCurrentYear(),
            showTooltip: { visibility: 'visible' },
            showCards: { visibility: 'hidden' },
            hideTable: true,
            export: "Value as of, Serial #, Series, Denomination, Issue Date, Next Accrual, Final Maturity, Issue Price, Interest, Value",
            exportResults: [],
            pages: [],
            perPage: 5,
            currentPage: 0,
            errorMessage: null,
            denominationOptions: [50, 75, 100, 200, 500, 1000, 5000, 10000],
            containerStyle: null
        }

        this.onUpdateEnter = this.onUpdateEnter.bind(this)
        this.onUpdateClick = this.onUpdateClick.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.setPrevPage = this.setPrevPage.bind(this)
        this.setCurrentPage = this.setCurrentPage.bind(this)
        this.setNextPage = this.setNextPage.bind(this)
        this.exportOnClick = this.exportOnClick.bind(this)
        this.handleClickX = this.handleClickX.bind(this)
    }

    componentDidMount() {
        const pageWidth = document.documentElement.clientWidth
        if (pageWidth < 1000) {
            this.setState({ containerStyle: { width: '90%', margin: 'auto' } })
        }
        else {
            this.setState({ containerStyle: { width: '75%', margin: 'auto' } })
        }
    }

    handleError(series) {
        if (series === 'I') {
            this.setState({ errorMessage: "Series I Bonds have been issued from September, 1998 to the present. Please adjust your issue date and re-submit." })
        }
        else if (series === 'EE') {
            this.setState({ errorMessage: "Series EE Bonds have been issued from January, 1980 to the present. Please adjust your issue date and re-submit." })
        }
        else if (series === 'E') {
            this.setState({ errorMessage: "Series E Bonds were issued between May, 1941 and June, 1980. Please adjust your issue date and re-submit." })
        }
        else if (series === 'S') {
            this.setState({ errorMessage: "Savings Notes were issued between May, 1967 and October, 1970. Please adjust your issue date and re-submit." })
        }
    }

    handleClickX(i) {
        const newBonds = this.state.bonds

        let x = (this.state.currentPage * this.state.perPage) + i

        this.setState({
            totalDenomination: this.state.totalDenomination - newBonds[x]['denomination'],
            totalPrice: this.state.totalPrice - newBonds[x]['iPrice'],
            totalInterest: this.state.totalInterest - newBonds[x]['interest'],
            totalValue: this.state.totalValue - newBonds[x]['value']
        })

        newBonds.splice(x, 1)
        this.setState({ bonds: newBonds })

        this.setPages(newBonds)
    }

    setPages(bonds) {
        let pages = []
        let pageCount = bonds.length / this.state.perPage

        let i = 0
        while (i < pageCount) {
            pages.push(i)

            i++
        }

        this.setState({ pages: pages })
    }

    exportOnClick() {
        const bonds = this.state.bonds

        let bondExports = []

        bondExports.push(['Lookup Date', 'Serial Number', 'Series', 'Bond Amount', 'Issue Date', 'Next Accrual', 'Final Maturity', 'Issue Price', 'Interest', 'Bond Value'])

        for (let i = 0; i < bonds.length; i++) {

            let bondExport = [
                bonds[i]['vDate'],
                bonds[i]['serialNumber'],
                bonds[i]['series'],
                '$' + bonds[i]['denomination'],
                bonds[i]['iDate'],
                bonds[i]['aDate'],
                bonds[i]['mDate'],
                '$' + parseFloat(bonds[i]['iPrice']).toFixed(2),
                '$' + parseFloat(bonds[i]['interest']).toFixed(2),
                '$' + parseFloat(bonds[i]['value']).toFixed(2)
            ]

            bondExports.push(bondExport);
        }

        bondExports.push([
            "",
            "",
            "",
            '$' + this.state.totalDenomination,
            "",
            "",
            "",
            '$' + parseFloat(this.state.totalPrice).toFixed(2),
            '$' + parseFloat(this.state.totalInterest).toFixed(2),
            '$' + parseFloat(this.state.totalValue).toFixed(2)
        ])

        this.setState({ exportResults: bondExports })
    }

    setCurrentPage(i) {
        this.setState({ currentPage: i })
    }

    setPrevPage() {
        let showCount = (this.state.currentPage - 1) * this.state.perPage
        if (showCount >= 0) {
            this.setState({ currentPage: this.state.currentPage - 1 })
        }
    }

    setNextPage() {
        let showCount = (this.state.currentPage + 1) * this.state.perPage
        if (showCount < this.state.bonds.length) {
            this.setState({ currentPage: this.state.currentPage + 1 })
        }
    }

    formatDate(value_date) {
        const months = { "1": "Jan.", "2": "Feb.", "3": "March", "4": "April", "5": "May", "6": "June", "7": "July", "8": "Aug.", "9": "Sept", "10": "Oct", "11": "Nov", "12": "Dec" }

        let month = value_date.split('/')[0]
        let year = value_date.split('/')[1]

        let month_string = months[parseInt(month)] + ' 1, ' + year

        return month_string
    }

    getCurrentMonth() {
        let d = new Date();
        return d.getMonth() + 1
    }

    getCurrentYear() {
        let d = new Date();

        return d.getFullYear()
    }

    onUpdateEnter(e) {
        e.preventDefault();

        setTimeout(() => {
            this.setState({ showTooltip: { visibility: 'hidden' } })
        }, 3500)
    }

    onUpdateClick() {
        const bondState = this.state.bonds

        let bonds = []

        let vMonth = document.getElementsByName('aMonth')[0].value
        let vYear = document.getElementsByName('aYear')[0].value
        let vDate = vMonth + '/' + vYear

        this.setState({ updateDate: vDate })

        for (let i = 0; i < bondState.length; i++) {
            let bond = {
                'vMonth': vMonth,
                'vYear': vYear,
                'series': this.state.bonds[i]['series'],
                'denomination': this.state.bonds[i]['denomination'],
                'serialNumber': this.state.bonds[i]['serialNumber'],
                'iDate': this.state.bonds[i]['iDate']
            }

            bonds.push(bond)
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ bonds })
        };

        fetch('https://secure.thesavingsbondwizard.com/update', requestOptions)
            .then(response => response.json())
            .then(response => {
                if (response[0] !== 'error') {
                    this.setState({
                        totalDate: this.formatDate(response[1]['totalDate']),
                        totalDenomination: response[1]['totalDenominations'],
                        totalPrice: response[1]['totalPrices'],
                        totalInterest: response[1]['totalInterests'],
                        totalValue: response[1]['totalValues']
                    })

                    this.setState({ bonds: response[0] })
                }
                else {
                    this.setState({ totalDate: this.formatDate(vDate) })
                }
            })
    }

    onSubmit(e) {
        e.preventDefault();
        const bondState = this.state.bonds
        const series = e.target.series.value

        let currentDate = e.target.aMonth.value + '/' + e.target.aYear.value

        let bonds = []

        let bond = {
            'vMonth': e.target.aMonth.value,
            'vYear': e.target.aYear.value,
            'series': e.target.series.value,
            'denomination': parseInt(e.target.denomination.value),
            'serialNumber': e.target.serialnumber.value,
            'iDate': e.target.iMonth.value + '/' + e.target.iYear.value
        }

        bonds.push(bond)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ bonds })
        };

        fetch('https://secure.thesavingsbondwizard.com/update', requestOptions)
            .then(response => response.json())
            .then(response => {
                try {
                    if (response[0] !== 'error') {
                        const { bonds, totalDenomination, totalPrice, totalInterest, totalValue } = this.state
                        let nextBond = response[0]

                        if (bonds.length > 0) {
                            for (let i = 0; i < bonds.length; i++) {
                                nextBond.push(bonds[i])
                            }
                        }

                        this.setState({ bonds: nextBond, errorMessage: null })

                        this.setState({
                            totalDate: this.formatDate(response[1]['totalDate']),
                            totalDenomination: totalDenomination + response[1]['totalDenominations'],
                            totalPrice: totalPrice + response[1]['totalPrices'],
                            totalInterest: totalInterest + response[1]['totalInterests'],
                            totalValue: totalValue + response[1]['totalValues']
                        })

                        this.setState({ hideTable: false })

                        this.setPages(nextBond)

                        if (bondState.length > 0 && this.state.updateDate !== currentDate) {
                            this.onUpdateClick()
                        }
                    }
                    else {
                        this.handleError(series)
                    }
                }
                catch {
                    this.handleError(series)
                }
            })
    }

    convertValues(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    onSeriesChange() {
        let series = document.getElementsByName('series')[0].value
        if (series === 'S') {
            this.setState({ denominationOptions: [25, 50, 75, 100] })
        }
        else if (series === 'E') {
            this.setState({ denominationOptions: [25, 50, 75, 100, 200, 500, 1000, 5000, 10000] })
        }
        else {
            this.setState({ denominationOptions: [50, 75, 100, 200, 500, 1000, 5000, 10000] })
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="jumbotron-pages"></div>
                {this.state.errorMessage ?
                    <Alert key={this.state.errorMessage} variant='danger' style={{ width: '70%', margin: 'auto', fontSize: '.9em', textAlign: 'center', marginTop: '.5em' }}>
                        {this.state.errorMessage}
                    </Alert>
                    : null}
                <div style={this.state.containerStyle ? this.state.containerStyle : { width: '75%', margin: 'auto' }}>
                    <div style={{ width: '100%', marginTop: '2em' }}>
                        <Form onSubmit={this.onSubmit} style={{ width: '100%', fontSize: '14px' }}>
                            <Form.Row>
                                <Col className="col-padding">
                                    <Form.Label>VALUE AS OF</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            required
                                            name="aMonth"
                                            type="number"
                                            placeholder="Month"
                                            min="1"
                                            max="12"
                                            defaultValue={this.state.month}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text id="inputGroupPrepend">/</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control
                                            required
                                            name="aYear"
                                            type="number"
                                            placeholder="Year"
                                            maxLength="4"
                                            min="1992"
                                            max={this.state.year}
                                            style={{ marginLeft: '-1px' }}
                                            defaultValue={this.state.year}
                                        />
                                    </InputGroup>
                                    <OverlayTrigger placement='right' overlay={
                                        <Tooltip style={this.state.showTooltip} >
                                            Revalue all bonds by this date.
                                    </Tooltip>}>
                                        <Button type="button" size='sm' variant='success' onMouseEnter={this.onUpdateEnter} onClick={this.onUpdateClick} style={{ position: 'absolute', top: '0', right: '.75em', fontSize: '.65em', fontWeight: 'bold' }}>UPDATE</Button>
                                    </OverlayTrigger>
                                    <Card className="card-margin-top">
                                        <Card.Header className='card-header'>VALUED AS OF</Card.Header>
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            <Card.Title>{this.state.totalDate}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="col-padding">
                                    <Form.Label>SERIES</Form.Label>
                                    <Form.Control onChange={() => this.onSeriesChange()} name="series" as="select" custom>
                                        <option value="EE">EE Bond</option>
                                        <option value="I">I Bond</option>
                                        <option value="E">E Bond</option>
                                        <option value="S">Savings Note</option>
                                    </Form.Control>
                                    <Card className="card-margin-top">
                                        <Card.Header className='card-header'>TOTAL FACE VALUE</Card.Header>
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            <Card.Title>${this.convertValues(this.state.totalDenomination)}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="col-padding">
                                    <Form.Label>DENOMINATION</Form.Label>
                                    <Form.Control name="denomination" as="select" custom>
                                        {this.state.denominationOptions.map((opt) => (
                                            <option key={opt} value={opt}>${this.convertValues(opt)}</option>
                                        ))}
                                    </Form.Control>
                                    <Card className="card-margin-top">
                                        <Card.Header className='card-header'>TOTAL PRICE</Card.Header>
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            <Card.Title id="card-price" style={{ color: 'red' }}>${this.convertValues(parseFloat(this.state.totalPrice).toFixed(2))}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="col-padding">
                                    <Form.Label size='sm'>SERIAL NUMBER</Form.Label>
                                    <Form.Control
                                        name="serialnumber"
                                        type="text"
                                        placeholder="Optional"
                                    />
                                    <Card className="card-margin-top">
                                        <Card.Header className='card-header'>TOTAL INTEREST</Card.Header>
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            <Card.Title id="card-interest" style={{ color: '#ff8c00' }}>${this.convertValues(parseFloat(this.state.totalInterest).toFixed(2))}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="col-padding">
                                    <Form.Label>ISSUE DATE</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            required
                                            name="iMonth"
                                            type="number"
                                            placeholder="Month"
                                            maxLength="2"
                                            min="1"
                                            max="12"
                                            className={this.state.errorMessage ? 'highlight' : null}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text id="inputGroupPrepend">/</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control
                                            required
                                            name="iYear"
                                            type="number"
                                            placeholder="Year"
                                            maxLength="4"
                                            max={this.state.year}
                                            style={{ marginLeft: '-1px' }}
                                            className={this.state.errorMessage ? 'highlight' : null}
                                        />
                                    </InputGroup>
                                    <Button type="submit" size='sm' style={{ position: 'absolute', top: '0', right: '.5em', fontSize: '.65em', fontWeight: 'bold' }}>SUBMIT</Button>
                                    <Card className="card-margin-top">
                                        <Card.Header className='card-header'>TOTAL VALUE</Card.Header>
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            <Card.Title id="card-value" style={{ color: 'green' }}>${this.convertValues(parseFloat(this.state.totalValue).toFixed(2))}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Form.Row>
                        </Form >
                        <div id="card-container" style={{ width: '100%', float: 'left', paddingTop: '1em' }}>
                            {this.state.bonds.length > 0 ? <div onClick={this.exportOnClick} style={{ width: '100%', textAlign: 'right', marginBottom: '.25em' }}>
                                <CSVLink filename={'bonds_valued_from_' + this.state.month + '_' + this.state.year} data={this.state.exportResults.length > 0 ? this.state.exportResults : ''}>Export</CSVLink>
                            </div> : null}
                        </div >
                        <div style={{ width: '100%', float: 'left', margin: '0 0 1em 0' }}>
                            {
                                this.state.bonds.length > 0 ?
                                    <div>
                                        <Table striped bordered hover id="bond-table" hidden={this.state.hideTable} onChange={this.state.changeTable} style={{ width: '100%', margin: 'auto' }}>
                                            <thead style={{ textAlign: "center", fontSize: ".75em", textTransform: "uppercase" }}>
                                                <tr>
                                                    <th>Serial #</th>
                                                    <th>Series</th>
                                                    <th>Face Value</th>
                                                    <th>Issue Date</th>
                                                    <th>Next Accrual</th>
                                                    <th>Final Maturity</th>
                                                    <th>Issue Price</th>
                                                    <th>Interest</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.bonds
                                                    .slice(this.state.currentPage * this.state.perPage, (this.state.currentPage + 1) * this.state.perPage)
                                                    .map((bond, i) => (
                                                        <tr key={i}>
                                                            <td>{bond['serialNumber']}</td>
                                                            <td>{bond['series']}</td>
                                                            <td>${this.convertValues(bond['denomination'])}</td>
                                                            <td>{bond['iDate']}</td>
                                                            <td>{bond['aDate']}</td>
                                                            <td>{bond['mDate']}</td>
                                                            <td>${this.convertValues(parseFloat(bond['iPrice']).toFixed(2))}</td>
                                                            <td>${this.convertValues(parseFloat(bond['interest']).toFixed(2))}</td>
                                                            <td style={{ position: 'relative' }}>
                                                                ${this.convertValues(parseFloat(bond['value']).toFixed(2))}
                                                                <button onClick={() => this.handleClickX(i)} className='close' style={{ position: 'absolute', top: '.5em', right: '-1em' }}>
                                                                    <span aria-hidden='true' style={{ border: 'none' }}>&times;</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                        {this.state.bonds.length > this.state.perPage ?
                                            <Pagination size='sm'>
                                                <Pagination.Prev onClick={this.setPrevPage} />
                                                {this.state.pages.map((i) => (
                                                    <Pagination.Item active={i === this.state.currentPage} key={i} onClick={() => this.setCurrentPage(i)}>{i + 1}</Pagination.Item>
                                                ))}
                                                <Pagination.Next onClick={this.setNextPage} />
                                            </Pagination>
                                            : null}
                                    </div>
                                    : null}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default BondPricingOne;

