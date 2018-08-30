import React from 'react'
import TransitionGroup from './TransitionGroup/TransitionGroup'

interface SlideDownContentProps extends SlideDownProps {
    forwardedRef: React.RefObject<HTMLDivElement>
}

class SlideDownContent extends React.Component<SlideDownContentProps> {

    static defaultProps = {
        transitionOnAppear: true,
        closed: false
    }

    private outerRef: React.RefObject<HTMLDivElement>
    private callbacks: Function[]

    constructor(props: SlideDownContentProps) {
        super(props)
        this.outerRef = props.forwardedRef || React.createRef()
        this.callbacks = []
    }

    componentDidMount() {
        if (this.props.closed) {
            this.outerRef.current.classList.add('closed')
        }
    }

    componentWillAppear(callback: Function) {
        if (this.props.transitionOnAppear) {
            this.callbacks.push(callback)
            this.startTransition('0px')
        } else {
            this.outerRef.current.style.height = this.props.closed ? '0px' : 'auto'
            callback()
        }
    }

    componentWillEnter(callback: Function) {
        this.callbacks.push(callback)
        const prevHeight = this.outerRef.current.getBoundingClientRect().height + 'px'
        this.startTransition(prevHeight)
    }

    componentWillLeave(callback: Function) {
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
            return null
        }
    }

    componentDidUpdate(_prevProps, _prevState, snapshot: string | null) {
        /* Terminate any active transition */
        const callback = this.callbacks.shift()
        callback && callback()

        if (this.callbacks.length === 0) {
            const prevHeight = snapshot || getComputedStyle(this.outerRef.current).height
            this.startTransition(prevHeight)
        }
    }

    startTransition(prevHeight: string) {
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

    handleTransitionEnd = (evt: React.TransitionEvent) => {
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
function TransitionGroupWrapper(props) {
    const childrenArray = React.Children.toArray(props.children)
    return childrenArray[0] || null
}

const SlideDownComponent: React.SFC<SlideDownContentProps> = (props) => {
    const { children, ...attrs } = props
    const hasContent = (children && React.Children.count(children) !== 0)

    return (
        <TransitionGroup component={TransitionGroupWrapper}>
            {hasContent && <SlideDownContent key={'content'} {...attrs}>{children}</SlideDownContent>}
        </TransitionGroup>
    )
}

interface SlideDownProps {
    className?: string
    transitionOnAppear?: boolean
    closed?: boolean
}

export const SlideDown = React.forwardRef((props: SlideDownProps, ref: React.RefObject<HTMLDivElement>) => (
    <SlideDownComponent {...props} forwardedRef={ref} />
))

export default SlideDown