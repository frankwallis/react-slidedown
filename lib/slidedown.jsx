import React from 'react'
import TransitionGroup from './TransitionGroup/TransitionGroup'

class SlideDownContent extends React.Component {

    static defaultProps = {
        transitionOnAppear: true,
        closed: false
    }

    constructor(props) {
        super(props)
        this.outerRef = props.forwardedRef || React.createRef()
        this.callbacks = []
    }

    componentDidMount() {
        if (this.props.closed) {
            this.outerRef.current.classList.add('closed')
        }
    }

    componentWillAppear(callback) {
        if (this.props.transitionOnAppear) {
            this.callbacks.push(callback)
            this.startTransition('0px')
        } else {
            this.outerRef.current.style.height = this.props.closed ? '0px' : 'auto'
            callback()
        }
    }

    componentWillEnter(callback) {
        this.callbacks.push(callback)
        const prevHeight = this.outerRef.current.getBoundingClientRect().height + 'px'
        this.startTransition(prevHeight)
    }

    componentWillLeave(callback) {
        this.callbacks.push(callback)
        this.outerRef.current.classList.add('transitioning')
        this.outerRef.current.style.height = getComputedStyle(this.outerRef.current).height
        this.outerRef.current.offsetHeight // force repaint
        this.outerRef.current.style.transitionProperty = 'height'
        this.outerRef.current.style.height = '0px'
    }

    getSnapshotBeforeUpdate() {
        /* Prepare to resize */
        if (this.callbacks.length === 0) {
            return this.outerRef.current.getBoundingClientRect().height + 'px'
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /* Terminate any active transition */
        const callback = this.callbacks.shift()
        callback && callback()

        if (this.callbacks.length === 0) {
            const prevHeight = snapshot || getComputedStyle(this.outerRef.current).height
            this.startTransition(prevHeight)
        }
    }

    startTransition(prevHeight) {
        let endHeight = '0px'

        if (!this.props.closed) {
            this.outerRef.current.classList.remove('closed')
            this.outerRef.current.style.height = 'auto'
            endHeight = getComputedStyle(this.outerRef.current).height
        }

        if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
            this.outerRef.current.classList.add('transitioning')
            this.outerRef.current.style.height = prevHeight
            this.outerRef.current.offsetHeight // force repaint
            this.outerRef.current.style.transitionProperty = 'height'
            this.outerRef.current.style.height = endHeight
        }
    }

    handleTransitionEnd = (evt) => {
        if ((evt.target === this.outerRef.current) && (evt.propertyName === 'height')) {
            const callback = this.callbacks.shift()
            callback && callback()

            /* sometimes callback() executes componentWillEnter */
            if (this.callbacks.length === 0) {
                this.outerRef.current.classList.remove('transitioning')
                this.outerRef.current.style.transitionProperty = 'none'
                this.outerRef.current.style.height = this.props.closed ? '0px' : 'auto'

                if (this.props.closed) {
                    this.outerRef.current.classList.add('closed')
                }
            }
        }
    }

    render() {
        const className = this.props.className ?
            'react-slidedown ' + this.props.className : 'react-slidedown'

        return (
            <div className={className}
                ref={this.outerRef}
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

function SlideDownComponent(props) {
    const { children, ...attrs } = props
    const hasContent = (children && React.Children.count(children) !== 0)

    return (
        <TransitionGroup component={SlideDownWrapper}>
            {hasContent && <SlideDownContent key={'content'} {...attrs}>{children}</SlideDownContent>}
        </TransitionGroup>
    )
}

export const SlideDown = React.forwardRef((props, ref) => (
    <SlideDownComponent {...props} forwardedRef={ref} />
))

export default SlideDown