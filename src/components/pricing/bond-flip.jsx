import React, { Component } from 'react';
import arrows from "../../images/arrows.jpg";

class BondFlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outerWidth: null,
            outerHeight: null,
            innerWidth: null,
            innerHeight: null
        }

        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);

        this.setState({ outerWidth: window.outerWidth, outerHeight: window.outerHeight, innerWidth: window.innerWidth, innerHeight: window.innerHeight })
    }

    handleResize() {
        setTimeout(() => {
            this.setState({ outerWidth: window.outerWidth, outerHeight: window.outerHeight, innerWidth: window.innerWidth, innerHeight: window.innerHeight })
        }, 250);
    }

    render() {
        return (
            <div style={{ marginTop: '3rem', width: '100%', textAlign: 'center' }}>
                <div>{this.state.outerWidth}</div>
                <div>{this.state.innerWidth}</div>
                <div>{this.state.outerHeight}</div>
                <div>{this.state.innerHeight}</div>
                <p style={{ fontWeight: 'bold' }}>This app feature requires a wide screen view.</p>
                <img className="flip-arrows" style={{ marginTop: '1rem' }} src={arrows} alt='Flip arrows for app view'></img>
            </div>
        );
    }
}

export default BondFlip;