import React from 'react'
import Dropdown from './dropdown'

export default class Main extends React.Component {
    constructor (props) {
        super(props);
        this.state = { open: false }
    }

    render() {
        return (
            <div className={'main-container'}>
                <button className={'main-toggle'} onClick={this.handleToggle}>Toggle</button>
                <div className={'main-columns'}>
                    {this.renderColumn(10, false)}
                    {this.renderColumn(20, true)}
                    {this.renderColumn(30, false)}
                    {this.renderColumn(40, true)}
                </div>
            </div>
        )
    }

    renderColumn(maxItems, overlay) {
        return (
            <div className={'main-column'}>
                <span>I am above</span>
                <Dropdown maxItems={maxItems} open={this.state.open} overlay={overlay} />
                <span>I am below</span>
            </div>
        )
    }

    handleToggle = () => {
        this.setState(state => ({open: !state.open}))
    }
}