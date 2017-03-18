import React from 'react'

export class SlideIn extends React.Component {
    render() {
        return (
            <div className={'react-slidein-wrapper'}>
                <div className={'react-slidein-content'}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}