import * as React from 'react'
import * as TransitionGroup from 'react-addons-transition-group'
//import * as TransitionGroup from 'react-transition-group/TransitionGroup'

class SlideInContent extends React.Component {

    static defaultProps = {
        transitionOnAppear: true,
        closed: false
    }

    handleRef = (element) => {
        this.element = element
        this.callbacks = []
    }

    componentDidMount() {
        if (this.props.closed)
            this.element.classList.add('closed')
    }

    componentWillAppear(callback) {
        if (this.props.transitionOnAppear) {
            this.callbacks.push(callback)
            this.startTransition('0px')
        }
        else {
            this.element.style.height = this.props.closed ? '0px' : 'auto'
            callback()
        }
    }

    componentWillEnter(callback) {
        this.callbacks.push(callback)
        const prevHeight = this.element.getBoundingClientRect().height + 'px'
        this.startTransition(prevHeight)
    }

    componentWillLeave(callback) {
        this.callbacks.push(callback)
        this.element.classList.add('transitioning')
        this.element.style.height = getComputedStyle(this.element).height
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = '0px'
    }

    componentWillUpdate() {
        /* Prepare to resize */
        if (this.callbacks.length === 0) {
            this.element.style.height = this.element.getBoundingClientRect().height + 'px'
        }
    }

    componentDidUpdate() {
        /* Terminate any active transition */
        const callback = this.callbacks.shift()
        callback && callback()

        if (this.callbacks.length === 0) {
            const prevHeight = getComputedStyle(this.element).height
            this.startTransition(prevHeight)
        }
    }

    startTransition(prevHeight) {
        let endHeight = '0px'

        if (!this.props.closed) {
            this.element.classList.remove('closed')
            this.element.style.height = 'auto'
            endHeight = getComputedStyle(this.element).height
        }

        if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
            this.element.classList.add('transitioning')
            this.element.style.height = prevHeight
            this.element.offsetHeight // force repaint
            this.element.style.transitionProperty = 'height'
            this.element.style.height = endHeight
        }
    }

    handleTransitionEnd = (evt) => {
        if ((evt.target === this.element) && (evt.propertyName === 'height')) {
            const callback = this.callbacks.shift()
            callback && callback()

            /* sometimes callback() executes componentWillEnter */
            if (this.callbacks.length === 0) {
                this.element.classList.remove('transitioning')
                this.element.style.transitionProperty = 'none'
                this.element.style.height = this.props.closed ? '0px' : 'auto'

                if (this.props.closed)
                    this.element.classList.add('closed')
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
function SlideInWrapper(props) {
    const childrenArray = React.Children.toArray(props.children)
    return childrenArray[0] || null
}

export function SlideIn(props) {
    const { children, ...attrs } = props
    const hasContent = (children && React.Children.count(children) !== 0)

    return (
        <TransitionGroup component={SlideInWrapper}>
            {hasContent && <SlideInContent key={'content'} {...attrs}>{children}</SlideInContent>}
        </TransitionGroup>
    )
}
