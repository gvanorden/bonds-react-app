import React, { Component } from 'react';
import bond from '../images/bond.png';

class BondExample extends Component {
    state = {}
    render() {
        return (
            <div style={{ width: '60%', margin: 'auto', paddingTop: '5em' }}>
                <img src={bond} alt="treasury bond" style={{ height: '100%', width: '100%' }}></img>
            </div>);
    }
}

export default BondExample;