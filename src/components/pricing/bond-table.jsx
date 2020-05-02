import React, { Component } from 'react';
import { CSVLink } from "react-csv";
import { Table, Pagination } from 'react-bootstrap';
import "../../styles/individual.css";



class BondTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            exportResults: []
        }

        this.handleClickX = this.handleClickX.bind(this)
        this.setPrevPage = this.setPrevPage.bind(this)
        this.setCurrentPage = this.setCurrentPage.bind(this)
        this.setNextPage = this.setNextPage.bind(this)
        this.exportOnClick = this.exportOnClick.bind(this)
    }

    setCurrentPage(i) {
        this.setState({ currentPage: i })
    }

    setPrevPage() {
        let showCount = (this.state.currentPage - 1) * this.props.perPage
        if (showCount >= 0) {
            this.setState({ currentPage: this.state.currentPage - 1 })
        }
    }

    setNextPage() {
        let showCount = (this.state.currentPage + 1) * this.props.perPage
        if (showCount < this.props.bonds.length) {
            this.setState({ currentPage: this.state.currentPage + 1 })
        }
    }

    handleClickX(i) {
        const newBonds = this.props.bonds

        let x = (this.state.currentPage * this.state.perPage) + i

        this.props.setTotals(newBonds[x]['denomination'], newBonds[x]['iPrice'], newBonds[x]['interest'], newBonds[x]['value'])

        newBonds.splice(x, 1)

        this.props.setPages(newBonds)
    }

    exportOnClick() {
        const bonds = this.props.bonds

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
            '$' + this.props.totalDenomination,
            "",
            "",
            "",
            '$' + parseFloat(this.props.totalPrice).toFixed(2),
            '$' + parseFloat(this.props.totalInterest).toFixed(2),
            '$' + parseFloat(this.props.totalValue).toFixed(2)
        ])

        this.setState({ exportResults: bondExports })
    }


    convertValues(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    render() {
        const { hiddenTable, windowHeight, windowWidth, setClass } = this.props

        return (
            <React.Fragment>
                {this.props.bonds.length > 0 ?
                    <div onClick={this.exportOnClick} style={{ width: '100%', textAlign: 'right', margin: '.75rem 0 .25em 0' }}>
                        <CSVLink filename={'bonds_valued_from_' + this.props.currentMonth + '_' + this.props.currentYear} data={this.state.exportResults.length > 0 ? this.state.exportResults : ''}>Export</CSVLink>
                    </div> : null}
                <Table className={setClass('bond-table')} size={windowWidth < 1024 ? 'sm' : 'lg'} striped hover hidden={hiddenTable}>
                    <thead className={setClass('bond-table-head')}>
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
                        {this.props.bonds
                            .slice(this.state.currentPage * this.props.perPage, (this.state.currentPage + 1) * this.props.perPage)
                            .map((bond, i) => (
                                <tr key={i} className={setClass('bond-table-row')}>
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
                                        <button onClick={() => this.handleClickX(i)} className={windowHeight < 500 ? 'close-mobile' : 'close'}>
                                            <span aria-hidden='true' style={{ border: 'none' }}>&times;</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
                {
                    this.props.bonds.length > this.props.perPage ?
                        <Pagination className='bond-pagination' size='sm'>
                            <Pagination.Prev onClick={this.setPrevPage} />
                            {this.props.pages.map((i) => (
                                <Pagination.Item active={i === this.state.currentPage} key={i} onClick={() => this.setCurrentPage(i)}>{i + 1}</Pagination.Item>
                            ))}
                            <Pagination.Next onClick={this.setNextPage} />
                        </Pagination>
                        : null
                }
            </React.Fragment>
        );
    }
}

export default BondTable;