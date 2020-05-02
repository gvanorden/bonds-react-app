import React, { Component } from 'react';
import arrows from "../../images/arrows.jpg";

class BondFlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: null,
            windowHeight: null
        }

        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);

        this.setState({ windowWidth: window.outerWidth, windowHeight: window.outerHeight })
    }

    handleResize() {
        setTimeout(() => {
            this.setState({ windowWidth: window.outerWidth, windowHeight: window.outerHeight })
        }, 250);
    }

    render() {
        return (
            <div style={{ marginTop: '3rem', width: '100%', textAlign: 'center' }}>
                <div>{this.state.windowWidth}</div>
                <div>{this.state.windowHeight}</div>
                <p style={{ fontWeight: 'bold' }}>This app feature requires a wide screen view.</p>
                <img className="flip-arrows" style={{ marginTop: '1rem' }} src={arrows} alt='Flip arrows for app view'></img>
            </div>
        );
    }
}

export default BondFlip;