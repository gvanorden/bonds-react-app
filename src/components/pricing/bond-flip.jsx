import React, { Component } from 'react';
import arrows from "../../images/arrows.jpg";

class BondFlip extends Component {
    state = {}
    render() {
        return (
            <div style={{ marginTop: '3rem', width: '100%', textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold' }}>This app feature requires a wide screen view.</p>
                <img className="flip-arrows" style={{ marginTop: '1rem' }} src={arrows} alt='Flip arrows for app view'></img>
            </div>
        );
    }
}

export default BondFlip;