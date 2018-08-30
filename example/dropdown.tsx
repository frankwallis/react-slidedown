import React from 'react'
import { SlideDown } from '../lib/slidedown'

interface DropdownProps {
    open: boolean;
    overlay: boolean;
    alwaysRender: boolean;
    maxItems: number;
}

export default class Dropdown extends React.Component<DropdownProps> {
    render() {
        let className = 'dropdown-slidedown'
        let caption = this.props.open ? 'Down' : 'Up'
        let render = this.props.open;
        let closed = false;

        if (this.props.overlay) {
            className = 'dropdown-slidedown overlay'
            caption = this.props.open ? 'Open' : 'Closed'
        }

        if (this.props.alwaysRender) {
            render = true;
            closed = !this.props.open;
        }

        return (
            <div className={'dropdown-container'}>
                <span className={'narrative'}>{caption}</span>
                <SlideDown className={'pure-menu pure-menu-scrollable ' + className} closed={closed}>
                    {render && this.renderList()}
                </SlideDown>
            </div>
        )
    }

    renderList() {
        const count = Math.floor(Math.random() * this.props.maxItems) + 5
        const items = []
        for (var idx = 0; idx < count; idx++)
            items.push(<li key={idx} className={'pure-menu-item'}><span>{'Item ' + idx}</span></li>)
        return <div><ul className={'pure-menu-list dropdown-list'}>{items}</ul></div>
    }
}