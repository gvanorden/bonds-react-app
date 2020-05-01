import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import { Form, Table, Card, Col, InputGroup, Button, OverlayTrigger, Tooltip, Pagination } from "react-bootstrap";
import { CSVLink } from "react-csv";
import arrows from "../images/arrows.jpg";
import '../index.css'


class BondPricingTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bonds: [],
            exportBonds: [],
            label: 'Import ...',
            totalPrice: 0,
            totalInterest: 0,
            totalValue: 0,
            totalDenomination: 0,
            totalDate: this.formatDate(this.getCurrentMonth() + '/' + this.getCurrentYear()),
            month: this.getCurrentMonth(),
            year: this.getCurrentYear(),
            hideTable: true,
            showCards: { visibility: 'hidden' },
            exportData: [],
            export: "Value as of, Serial #, Series, Denomination, Issue Date, Next Accrual, Final Maturity, Issue Price, Interest, Value",
            exportResults: [],
            pages: [],
            perPage: 5,
            currentPage: 0,
            windowWidth: window.outerWidth,
            windowHeight: window.outerHeight
        };

        this.setFilename = this.setFilename.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.onUpdateEnter = this.onUpdateEnter.bind(this)
        this.onUpdateClick = this.onUpdateClick.bind(this)
        this.setPrevPage = this.setPrevPage.bind(this)
        this.setCurrentPage = this.setCurrentPage.bind(this)
        this.setNextPage = this.setNextPage.bind(this)
        this.exportOnClick = this.exportOnClick.bind(this)
        this.handleClickX = this.handleClickX.bind(this)
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

    mobile() {
        if (isMobile && this.state.windowWidth < 1024 && this.state.windowHeight < 500) {
            return '-mobile'
        }
        else {
            return ''
        }
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
        const months = { "01": "Jan.", "02": "Feb.", "03": "Mar.", "04": "April", "05": "May", "06": "June", "07": "July", "08": "Aug.", "09": "Sept.", "10": "Oct.", "11": "Nov.", "12": "Dec." }

        let month = value_date.split('/')[0]

        if (month.length === 1) {
            month = '0' + month
        }

        let year = value_date.split('/')[1]

        let month_string = months[month] + ' ' + year

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

    setFilename(e) {

        if (e.target.files.length > 0) {
            this.setState({ label: e.target.files[0].name })
        }

        if (this.state.hideTable) {
            this.setState({ hideTable: false, showCards: { visibility: 'visible' } })
        }
        try {
            if (e.target.files[0].name !== this.state.label) {
                this.setState({ currentPage: 0 })
            }

            var reader = new FileReader();

            reader.onload = () => {
                const bondCsv = reader.result

                let bonds = []

                let bondRow = bondCsv.split('\r')


                for (let i = 1; i < bondRow.length; i++) {
                    let bond = bondRow[i].split(',')

                    let bondDict = {
                        'vMonth': document.getElementsByName('aMonth')[0].value,
                        'vYear': document.getElementsByName('aYear')[0].value,
                        'serialNumber': bond[0],
                        'series': bond[1],
                        'denomination': parseInt(bond[2].replace(/[$]/g, '')),
                        'iDate': bond[3]
                    }

                    bonds.push(bondDict)
                }

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ bonds })
                };

                fetch('https://secure.thesavingsbondwizard.com/update', requestOptions)
                    .then(response => response.json())
                    .then(response => {
                        this.setState({ bonds: response[0] })

                        this.setState({
                            totalDate: this.formatDate(response[1]['totalDate']),
                            totalDenomination: response[1]['totalDenominations'],
                            totalPrice: response[1]['totalPrices'],
                            totalInterest: response[1]['totalInterests'],
                            totalValue: response[1]['totalValues']
                        })

                        this.setPages(response[0])
                    })
            }

            reader.readAsText(e.target.files[0]);
        }
        catch {

        }
    }

    convertValues(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    render() {
        const { windowWidth, windowHeight } = this.state

        return (
            <React.Fragment>
                <div className="jumbotron-pages"></div>
                {isMobile && (windowWidth < 500 || windowWidth < windowHeight) ?
                    <div style={{ marginTop: '3rem', width: windowWidth, textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold' }}>This app feature requires a wide screen view.</p>
                        <img className="flip-arrows" style={{ marginTop: '1rem' }} src={arrows} alt='Flip arrows for app view'></img>
                    </div> :
                    <div style={isMobile ? { maxWidth: windowWidth, padding: '0 1rem' } : { width: '70%', maxWidth: (windowWidth * .7), margin: 'auto' }}>
                        <div style={windowWidth <= 1024 ? { width: '100%', marginTop: '.5rem' } : { width: '100%', marginTop: '2rem' }}>
                            <Form>
                                <Form.Row style={windowWidth < 800 ? { float: 'left', width: '40.5%' } : { float: 'left', width: '20.25%' }}>
                                    <Col>
                                        <Form.Label className={'form-label' + this.mobile()}> VALUE AS OF</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                required
                                                name="aMonth"
                                                type="number"
                                                placeholder="Month"
                                                min="1"
                                                max="12"
                                                defaultValue={this.state.month}
                                                className={windowHeight < 500 ? 'input-mobile-date' : null}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text className={windowHeight < 500 ? 'input-mobile' : null} style={isMobile && windowWidth < 1024 ? { padding: '.375rem .5rem' } : null}>/</InputGroup.Text>
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
                                                className={windowHeight < 500 ? 'input-mobile-date' : null}
                                            />
                                        </InputGroup>
                                        <OverlayTrigger placement='right' overlay={
                                            <Tooltip style={this.state.showTooltip}>
                                                Revalue all bonds by this date.
                                    </Tooltip>}>
                                            <Button
                                                size='sm'
                                                type="button"
                                                variant='success'
                                                className={'form-button' + this.mobile()}
                                                onMouseEnter={this.onUpdateEnter}
                                                onClick={this.onUpdateClick}>
                                                UPDATE
                                        </Button>
                                        </OverlayTrigger>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col style={{ padding: '0 0 0 .5rem' }}>
                                        <Form.Label className={'form-label' + this.mobile()}>ATTACHMENT</Form.Label>
                                        <Form.File
                                            id="custom-file"
                                            label={this.state.label}
                                            onChange={this.setFilename}
                                            className={isMobile && windowHeight < 500 ? 'custom-mobile-input' : null}
                                            custom
                                        />
                                    </Col>
                                </Form.Row>
                            </Form>
                            <Form style={isMobile && windowWidth < 1024 ? { marginTop: '.5rem' } : { marginTop: '1.5rem' }}>
                                <Form.Row>
                                    <Col>
                                        <Card>
                                            <Card.Header className={'card-header' + this.mobile()}>VALUED AS OF</Card.Header>
                                            <Card.Body className={'card-body' + this.mobile()} style={windowHeight <= 320 ? { padding: '.75em .5em' } : { padding: '.75em' }}>
                                                <Card.Title className={'card-title' + this.mobile()}>{this.state.totalDate}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Header className={'card-header' + this.mobile()}>{isMobile && windowHeight <= 320 ? 'T. FACE VALUE' : 'TOTAL FACE VALUE'}</Card.Header>
                                            <Card.Body className={'card-body' + this.mobile()} style={windowHeight <= 320 ? { padding: '.75em .5em' } : { padding: '.75em' }}>
                                                <Card.Title className={'card-title' + this.mobile()}>${this.convertValues(this.state.totalDenomination)}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Header className={'card-header' + this.mobile()}>TOTAL PRICE</Card.Header>
                                            <Card.Body className={'card-body' + this.mobile()} style={windowHeight <= 320 ? { padding: '.75em .5em' } : { padding: '.75em' }}>
                                                <Card.Title className={'card-title' + this.mobile()} style={{ color: 'red' }} >${this.convertValues(parseFloat(this.state.totalPrice).toFixed(2))}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Header className={'card-header' + this.mobile()}>TOTAL INTEREST</Card.Header>
                                            <Card.Body className={'card-body' + this.mobile()} style={windowHeight <= 320 ? { padding: '.75em .5em' } : { padding: '.75em' }}>
                                                <Card.Title className={'card-title' + this.mobile()} style={{ color: '#ff8c00' }}>${this.convertValues(parseFloat(this.state.totalInterest).toFixed(2))}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Header className={'card-header' + this.mobile()}>TOTAL VALUE</Card.Header>
                                            <Card.Body className={'card-body' + this.mobile()} style={windowHeight <= 320 ? { padding: '.75em .5em' } : { padding: '.75em' }}>
                                                <Card.Title className={'card-title' + this.mobile()} style={{ color: 'green' }}>${this.convertValues(parseFloat(this.state.totalValue).toFixed(2))}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Form.Row>
                            </Form >
                            <div id="card-container" style={{ width: '100%', float: 'left', paddingTop: '1em' }}>
                                {this.state.bonds.length > 0 ? <div onClick={this.exportOnClick} style={{ width: '100%', textAlign: 'right', marginBottom: '.25em' }}>
                                    <CSVLink filename={'bonds_valued_from_' + this.state.month + '_' + this.state.year} data={this.state.exportResults.length > 0 ? this.state.exportResults : ''}>+ [Export]</CSVLink>
                                </div> : null}
                            </div >
                            <div style={{ width: '100%', float: 'left', margin: '0 0 1em 0' }}>
                                {
                                    this.state.bonds.length > 0 ?
                                        <div>
                                            <Table striped bordered size={isMobile ? 'sm' : null} hover id="bond-table" hidden={this.state.hideTable} onChange={this.state.changeTable} style={{ width: '100%', margin: 'auto' }}>
                                                <thead className={isMobile ? 'table-header-mobile' : 'table-header'}>
                                                    <tr>
                                                        <th>Serial Number</th>
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
                                                            <tr key={i} className={isMobile ? 'table-row-mobile' : 'table-row'}>
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
                                                                    <button onClick={() => this.handleClickX(i)} className={isMobile && windowHeight < 500 ? 'close-mobile' : 'close'}>
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
                            <Helmet>
                                <title>Bond Priceing - Spreadsheet</title>
                                <meta name='Price Bonds By Spreadsheet' content='Price all your I,E, EE Bonds and Savings Notes using a predefined spreadsheet' />
                                <link related='canonical' content='/bond_pricing_spreadsheet' />
                            </Helmet>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default BondPricingTwo;
