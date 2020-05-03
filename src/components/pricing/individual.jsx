import React, { Component } from 'react';
import { isMobile } from "react-device-detect";
import { Form, Col, InputGroup, Button, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import BondCards from "./bond-cards";
import BondTable from "./bond-table";
import BondFlip from "./bond-flip";
import "../../styles/individual.css";

class IndividualBonds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bonds: [],
            totalPrice: 0,
            totalInterest: 0,
            totalValue: 0,
            totalDenomination: 0,
            totalDate: this.formatDate(this.getCurrentMonth() + '/' + this.getCurrentYear()),
            updateDate: this.getCurrentMonth() + '/' + this.getCurrentYear(),
            currentMonth: this.getCurrentMonth(),
            currentYear: this.getCurrentYear(),
            denominationOptions: [50, 75, 100, 200, 500, 1000, 5000, 10000],
            showTooltip: { visibility: 'visible' },
            windowWidth: null,
            windowHeight: null,
            hiddenTable: true,
            errorMessage: null,
            pages: [],
            perPage: 5
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.onUpdateEnter = this.onUpdateEnter.bind(this)
        this.onUpdateClick = this.onUpdateClick.bind(this)
        this.setClass = this.setClass.bind(this)
        this.setTotals = this.setTotals.bind(this)
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
        const { windowWidth, windowHeight } = this.state

        if (windowWidth < 1024 && windowHeight > windowWidth) {
            return name + '-mobile-sm'
        }
        else if (windowWidth < 1024 && windowHeight < windowWidth) {
            return name + '-mobile'
        }
        else if (isMobile) {
            return name + '-tablet'
        }
        else {
            return name
        }
    }

    setTotals(denomination, price, interest, value) {
        this.setState({
            totalDenomination: this.state.totalDenomination - denomination,
            totalPrice: this.state.totalPrice - price,
            totalInterest: this.state.totalInterest - interest,
            totalValue: this.state.totalValue - value
        })
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

    getCurrentMonth() {
        let d = new Date();
        return d.getMonth() + 1
    }

    getCurrentYear() {
        let d = new Date();

        return d.getFullYear()
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

        //http://localhost:5000/update

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

                        this.setState({ bonds: nextBond, hiddenTable: false, errorMessage: null })

                        this.setState({
                            totalDate: this.formatDate(response[1]['totalDate']),
                            totalDenomination: totalDenomination + response[1]['totalDenominations'],
                            totalPrice: totalPrice + response[1]['totalPrices'],
                            totalInterest: totalInterest + response[1]['totalInterests'],
                            totalValue: totalValue + response[1]['totalValues']
                        })

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
        const { setClass } = this

        return (
            <div className={setClass('bond-container')} style={!isMobile ? { minWidth: (this.state.windowWidth * .6) } : null}>
                {this.state.errorMessage ? <Alert variant='danger' style={{ textAlign: 'center' }}>{this.state.errorMessage}</Alert> : null}
                {this.state.windowWidth < 500 ?
                    <BondFlip /> :
                    <React.Fragment>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Row>
                                <Col>
                                    <Form.Label className={setClass('form-label')}>VALUE AS OF</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            required
                                            name="aMonth"
                                            type="number"
                                            placeholder="Mo"
                                            min="1"
                                            max="12"
                                            defaultValue={this.state.currentMonth}
                                            className={setClass("form-month")}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text className={setClass('form-seperator')}>/</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control
                                            required
                                            name="aYear"
                                            type="number"
                                            placeholder="Year"
                                            maxLength="4"
                                            min="1992"
                                            max={this.state.currentYear}
                                            className={setClass("form-year")}
                                            defaultValue={this.state.currentYear}
                                        />
                                    </InputGroup>
                                    <OverlayTrigger placement='right' overlay={
                                        <Tooltip style={this.state.showTooltip} >
                                            Revalue all bonds by this date.
                                </Tooltip>}>
                                        <Button
                                            size='sm'
                                            type="button"
                                            variant='success'
                                            className={setClass("form-button")}
                                            onMouseEnter={this.onUpdateEnter}
                                            onClick={this.onUpdateClick}>
                                            UPDATE
                                        </Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col>
                                    <Form.Label className={setClass('form-label')}>SERIES</Form.Label>
                                    <Form.Control
                                        className={setClass('bond-input')}
                                        onChange={() => this.onSeriesChange()}
                                        name="series"
                                        as="select"
                                        custom
                                    >
                                        <option value="EE">EE Bond</option>
                                        <option value="I">I Bond</option>
                                        <option value="E">E Bond</option>
                                        <option value="S">Savings Note</option>
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Label className={setClass('form-label')}>DENOMINATION</Form.Label>
                                    <Form.Control className={setClass('bond-input')} name="denomination" as="select" custom>
                                        {this.state.denominationOptions.map((opt) => (
                                            <option key={opt} value={opt}>${this.convertValues(opt)}</option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Label className={setClass('form-label')}>SERIAL NUMBER</Form.Label>
                                    <Form.Control
                                        name="serialnumber"
                                        type="text"
                                        placeholder="Optional"
                                        className={setClass('bond-input')}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className={setClass('form-label')}>ISSUE DATE</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            required
                                            name="iMonth"
                                            type="number"
                                            placeholder="Mo"
                                            maxLength="2"
                                            min="1"
                                            max="12"
                                            className={this.state.errorMessage ? setClass('form-month') + ' highlight' : setClass('form-month')}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text className={setClass('form-seperator')}>/</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control
                                            required
                                            name="iYear"
                                            type="number"
                                            placeholder="Year"
                                            maxLength="4"
                                            max={this.state.currentYear}
                                            className={this.state.errorMessage ? setClass('form-year') + ' highlight' : setClass('form-year')}
                                        />
                                    </InputGroup>
                                    <Button type="submit" size='sm' className={setClass("form-button")}>SUBMIT</Button>
                                </Col>
                            </Form.Row>
                        </Form >
                        <BondCards
                            totalDate={this.state.totalDate}
                            totalPrice={this.state.totalPrice}
                            totalDenomination={this.state.totalDenomination}
                            totalInterest={this.state.totalInterest}
                            totalValue={this.state.totalValue}
                            windowWidth={this.state.windowWidth}
                            windowHeight={this.state.windowHeight}
                            setClass={this.setClass}
                        />
                        <BondTable
                            bonds={this.state.bonds}
                            totalPrice={this.state.totalPrice}
                            totalDenomination={this.state.totalDenomination}
                            totalInterest={this.state.totalInterest}
                            totalValue={this.state.totalValue}
                            currentMonth={this.state.currentMonth}
                            currentYear={this.state.currentYear}
                            hiddenTable={this.state.hiddenTable}
                            windowWidth={this.state.windowWidth}
                            windowHeight={this.state.windowHeight}
                            pages={this.state.pages}
                            perPage={this.state.perPage}
                            setTotals={this.setTotals}
                            setClass={this.setClass}
                        />
                    </React.Fragment>}
            </div>
        );
    }
}

export default IndividualBonds;