import React from 'react'
import TransitionGroup from 'react-transition-group/TransitionGroup'

class SlideDownContent extends React.Component {

    static defaultProps = {
        transitionOnAppear: true,
        closed: false
    }

    element = this.props.forwardedRef || React.createRef()
    callbacks = []

    componentDidMount() {
        if (this.props.closed)
            this.element.current.classList.add('closed')
    }

    componentWillAppear(callback) {
        if (this.props.transitionOnAppear) {
            this.callbacks.push(callback)
            this.startTransition('0px')
        }
        else {
            this.element.current.style.height = this.props.closed ? '0px' : 'auto'
            callback()
        }
    }

    componentWillEnter(callback) {
        this.callbacks.push(callback)
        const prevHeight = this.element.current.getBoundingClientRect().height + 'px'
        this.startTransition(prevHeight)
    }

    componentWillLeave(callback) {
        this.callbacks.push(callback)
        this.element.current.classList.add('transitioning')
        this.element.current.style.height = getComputedStyle(this.element.current).height
        this.element.current.offsetHeight // force repaint
        this.element.current.style.transitionProperty = 'height'
        this.element.current.style.height = '0px'
    }

    getSnapshotBeforeUpdate() {
        /* Prepare to resize */
        if (this.callbacks.length === 0) {
            return this.element.current.getBoundingClientRect().height + 'px'
        }
        return null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /* Terminate any active transition */
        const callback = this.callbacks.shift()
        callback && callback()

        if (this.callbacks.length === 0) {
            const prevHeight = snapshot || getComputedStyle(this.element.current).height
            this.startTransition(prevHeight)
        }
    }

    startTransition(prevHeight) {
        let endHeight = '0px'

        if (!this.props.closed) {
            this.element.current.classList.remove('closed')
            this.element.current.style.height = 'auto'
            endHeight = getComputedStyle(this.element.current).height
        }

        if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
            this.element.current.classList.add('transitioning')
            this.element.current.style.height = prevHeight
            this.element.current.offsetHeight // force repaint
            this.element.current.style.transitionProperty = 'height'
            this.element.current.style.height = endHeight
        }
    }

    handleTransitionEnd = (evt) => {
        if ((evt.target === this.element.current) && (evt.propertyName === 'height')) {
            const callback = this.callbacks.shift()
            callback && callback()

            /* sometimes callback() executes componentWillEnter */
            if (this.callbacks.length === 0) {
                this.element.current.classList.remove('transitioning')
                this.element.current.style.transitionProperty = 'none'
                this.element.current.style.height = this.props.closed ? '0px' : 'auto'

                if (this.props.closed)
                    this.element.current.classList.add('closed')
            }
        }
    }

    render() {
        const className = this.props.className ?
            'react-slidedown ' + this.props.className : 'react-slidedown'

        return (
            <div className={className}
                ref={this.element}
                onTransitionEnd={this.handleTransitionEnd}>
                {this.props.children}
            </div>
        )
    }
}

/* From React docs this removes the need for another wrapper div */
function SlideDownWrapper(props) {
    const childrenArray = React.Children.toArray(props.children)
    return childrenArray[0] || null
}

function SlideDown(props) {
    const { children, ...attrs } = props
    const hasContent = (children && React.Children.count(children) !== 0)

    return (
        <TransitionGroup component={SlideDownWrapper}>
            {hasContent && <SlideDownContent key={'content'} {...attrs}>{children}</SlideDownContent>}
        </TransitionGroup>
    )
}

const SlideDownComponent = SlideDown

SlideDown = React.forwardRef((props, ref) => (
    <SlideDownComponent {...props} forwardedRef={ref} />
))

export { SlideDown }
export default SlideDown