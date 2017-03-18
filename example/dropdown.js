import React from 'react'
import {SlideIn} from '../src/slidein'

export default class Dropdown extends React.Component {
    render() {
        return (
            <div className={'dropdown-container'}>
                <span>{this.props.open ? 'Open' : 'Closed'}</span>
                <SlideIn className={'dropdown-slidein'}>
                    {this.props.open && this.renderList()}
                </SlideIn>
            </div>
        )
    }

    renderList() {
        const count = Math.trunc(Math.random() * this.props.maxItems) + 5;
        const items = [];
        for (var idx = 0; idx < count; idx ++)
            items.push(<li key={idx}><span>{'Item ' + idx}</span></li>);
        return <ul className={'dropdown-list'}>{items}</ul>;
    }
}