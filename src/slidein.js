import React from 'react'
//import ReactTransitionGroup from 'react-addons-transition-group'
const ReactTransitionGroup = React.addons.TransitionGroup;
export class SlideIn extends React.Component {

    render() {
        const open = (this.props.children && React.Children.count(this.props.children) !== 0)
        const className = this.props.className ? 'react-slidein ' + this.props.className : 'react-slidein';

        return (
            <ReactTransitionGroup className={className} component={'div'} {...this.props}>
                { open && 
                    <SlideInContent key={'content'}>
                        {this.props.children}
                    </SlideInContent>
                }
            </ReactTransitionGroup>
        );
    }
}

class SlideInContent extends React.Component {
    handleRef = (element) => {
        this.element = element;
    }

    componentWillEnter(callback) {
        this.callback = callback;
        var prevHeight = this.element.style.height
        this.element.style.height = 'auto'
        var endHeight = getComputedStyle(this.element).height
        this.element.style.height = prevHeight
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = endHeight
    }

    componentWillLeave(callback) {
        this.callback = callback;
        this.element.style.height = getComputedStyle(this.element).height
        this.element.style.transitionProperty = 'height'
        this.element.offsetHeight // force repaint
        this.element.style.height = '0'
    }

    handleTransitionEnd = (evt) => {
        if (evt.propertyName == 'height') {
            this.element.style.height = 'auto'
            this.element.style.transitionProperty = 'none'
            this.callback();
            this.callback = null;
        }
    }

    render() {
        return (
            <div className={'react-slidein-content'}
                ref={this.handleRef}
                onTransitionEnd={this.handleTransitionEnd}>
                {this.props.children}
            </div>
        )
    }
}
