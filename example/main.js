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
                    {this.renderColumn(10)}
                    {this.renderColumn(20)}
                    {this.renderColumn(30)}
                    {this.renderColumn(40)}
                </div>
            </div>
        )
    }

    renderColumn(maxItems) {
        return (
            <div className={'main-column'}>
                <Dropdown maxItems={maxItems} open={this.state.open} />
            </div>
        )
    }

    handleToggle = () => {
        this.setState(state => ({open: !state.open}))
    }
}