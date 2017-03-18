import React from 'react'
import {SlideIn} from '../src/slidein'

export default class Dropdown extends React.Component {
    render() {
        return (
            <SlideIn>
                {this.props.open && this.renderList()}
            </SlideIn>
        )
    }

    renderList() {
        const count = Math.trunc(Math.random() * this.props.maxItems) + 5;
        const items = [];
        for (var idx = 0; idx < count; idx ++)
            items.push(<li key={idx}><span>{'Item ' + idx}</span></li>);
        return <ul>{items}</ul>;
    }
}