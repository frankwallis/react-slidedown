import React from 'react'
import Dropdown from './dropdown'

interface MainState {
    open: boolean;
}

export default class Main extends React.Component<{}, MainState> {
    constructor(props) {
        super(props)
        this.state = { open: false }
    }

    render() {
        return (
            <div className={'main-container'}>
                <button
                    className={'main-toggle pure-button pure-button-primary button-large'}
                    onClick={this.handleToggle}>Toggle</button>
                <button
                    className={'main-toggle pure-button pure-button-primary button-large'}
                    onClick={() => this.forceUpdate()}>Update</button>

                <div className={'main-columns'}>
                    {this.renderColumn(10, false, false)}
                    {this.renderColumn(30, true, true)}
                    {this.renderColumn(50, false, true)}
                    {this.renderColumn(100, true, false)}
                </div>
            </div>
        )
    }

    renderColumn(maxItems, overlay, alwaysRender) {
        return (
            <div className={'main-column'}>
                <span className={'narrative'}>{'I will ' + (overlay ? 'overlay' : 'push down')}</span>
                <Dropdown maxItems={maxItems} open={this.state.open} overlay={overlay} alwaysRender={alwaysRender} />
                <span className={'narrative'}>{'I am ' + (overlay ? 'underneath' : 'below')}</span>
            </div>
        )
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }))
    }
}