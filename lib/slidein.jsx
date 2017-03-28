import * as React from 'react'
import * as ReactTransitionGroup from 'react-addons-transition-group'

class SlideInContent extends React.Component {
    handleRef = (element) => {
        this.element = element
        this.callbacks = []
    }

    componentWillEnter(callback) {
        //console.log('enter', 'wilLEnter', this.callbacks.length)
        this.callbacks.push(callback)
        const prevHeight = this.element.offsetHeight + 'px'
        this.element.style.height = 'auto'
        const endHeight = getComputedStyle(this.element).height
        this.element.style.height = prevHeight
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = endHeight
        //console.log('leave', 'wilLEnter', this.callbacks.length)
    }

    componentWillLeave(callback) {
        //console.log('enter', 'willLeave', this.callbacks.length)
        this.callbacks.push(callback)
        this.element.style.height = getComputedStyle(this.element).height
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = '0px'
        //console.log('leave', 'willLeave', this.callbacks.length)
    }

    componentWillUpdate() {
        //console.log('enter', 'willUpdate', this.callbacks.length)
        
        /* Terminate any active transition */
        const callback = this.callbacks.shift()
        callback && callback()

        /* Prepare to resize */
        if (this.callbacks.length === 0) {
            this.element.style.height = this.element.offsetHeight + 'px'  
        }
        //console.log('leave', 'willUpdate', this.callbacks.length)
    }

    componentDidUpdate() {
        //console.log('enter', 'didUpdate', this.callbacks.length)
        if (this.callbacks.length === 0) {
            const prevHeight = this.element.offsetHeight + 'px'
            this.element.style.height = 'auto'
            const endHeight = getComputedStyle(this.element).height
            this.element.style.height = prevHeight
            this.element.offsetHeight // force repaint
            this.element.style.transitionProperty = 'height'
            this.element.style.height = endHeight
        }
        //console.log('leave', 'didUpdate', this.callbacks.length)
    }

    handleTransitionEnd = (evt) => {
        //console.log('enter', 'transitionEnd', this.callbacks.length)
        if (evt && evt.target !== this.element) {
            return
        }

        if (evt.propertyName === 'height') {
            const callback = this.callbacks.shift()
            callback && callback()

            /* sometimes callback() executes componentWillEnter */
            if (this.callbacks.length === 0) {
                this.element.style.transitionProperty = 'none'
                this.element.style.height = 'auto'
            }
        }
        //console.log('leave', 'transitionEnd', this.callbacks.length)
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
