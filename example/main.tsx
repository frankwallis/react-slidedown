import React from 'react'
import Dropdown from './dropdown'

interface MainState {
    open: boolean;
    itemCounts: number[];
}

export default class Main extends React.Component<{}, MainState> {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            itemCounts: this.generateItemCounts()
        }
    }

    generateItemCounts() {
        return [
            Math.floor(Math.random() * 10) + 5,
            Math.floor(Math.random() * 30) + 5,
            Math.floor(Math.random() * 60) + 5,
            Math.floor(Math.random() * 100) + 5
        ]
    }

    render() {
        return (
            <div className={'main-container'}>
                <button
                    className={'main-toggle pure-button pure-button-primary button-large'}
                    onClick={this.handleToggle}>Toggle</button>
                <button
                    className={'main-toggle pure-button pure-button-primary button-large'}
                    onClick={this.handleUpdate}>Update</button>
                <div className={'main-columns'}>
                    {this.renderColumn(this.state.itemCounts[0], false, false)}
                    {this.renderColumn(this.state.itemCounts[1], true, true)}
                    {this.renderColumn(this.state.itemCounts[2], false, true)}
                    {this.renderColumn(this.state.itemCounts[3], true, false)}
                </div>
            </div>
        )
    }

    renderColumn(itemCount, overlay, alwaysRender) {
        return (
            <div className={'main-column'}>
                <span className={'narrative'}>{'I will ' + (overlay ? 'overlay' : 'push down')}</span>
                <Dropdown itemCount={itemCount} open={this.state.open} overlay={overlay} alwaysRender={alwaysRender} />
                <span className={'narrative'}>{'I am ' + (overlay ? 'underneath' : 'below')}</span>
            </div>
        )
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }))
    }

    handleUpdate = () => {
        this.setState(_state => ({ itemCounts: this.generateItemCounts() }))
    }
}