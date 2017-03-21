import React from 'react'
//import ReactTransitionGroup from 'react-addons-transition-group'
const ReactTransitionGroup = React.addons.TransitionGroup

class SlideInContent extends React.Component {
    handleRef = (element) => {
        this.element = element
        this.callbacks = []
    }

    componentWillEnter(callback) {
        this.callbacks.push(callback)
        const prevHeight = this.element.offsetHeight + 'px'
        this.element.style.height = 'auto'
        const endHeight = getComputedStyle(this.element).height
        this.element.style.height = prevHeight
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = endHeight
    }

    componentWillLeave(callback) {
        this.callbacks.push(callback)
        this.element.style.height = getComputedStyle(this.element).height
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = '0'
    }

    componentDidUpdate() {
        /* Terminate any active transition */
        const previousCallback = this.callbacks.shift()
        previousCallback && previousCallback()
    }

    handleTransitionEnd = (evt) => {
        if (evt && evt.target !== this.element) {
            return
        }

        if (evt.propertyName == 'height') {
            const callback = this.callbacks.shift();
            callback();

            /* sometimes callback() executes componentWillEnter */
            if (this.callbacks.length === 0) {
                this.element.style.transitionProperty = 'none'
                this.element.style.height = 'auto'
            }
        }
    }

    render() {
        const className = this.props.className ?
            'react-slidein ' + this.props.className : 'react-slidein'

        return (
            <div className={className}
                ref={this.handleRef}
                onTransitionEnd={this.handleTransitionEnd}>
                {this.props.children}
            </div>
        )
    }
}

/* From React docs this removes the need for another wrapper div */
const SlideInWrapper = props => {
    const childrenArray = React.Children.toArray(props.children)
    return childrenArray[0] || null
}

export const SlideIn = props => {
    const open = (props.children && React.Children.count(props.children) !== 0)

    return (
        <ReactTransitionGroup component={SlideInWrapper}>
            {open &&
                <SlideInContent key={'content'} {...props}>
                    {props.children}
                </SlideInContent>
            }
        </ReactTransitionGroup>
    );
}
