import React from 'react'
import TransitionGroup from './TransitionGroup/TransitionGroup'

interface SlideDownContentProps extends SlideDownProps {
    forwardedRef: React.Ref<HTMLDivElement> | null
}

class SlideDownContent extends React.Component<SlideDownContentProps> {

    static defaultProps = {
        transitionOnAppear: true,
        closed: false
    }

    private outerRef: HTMLDivElement | null = null
    private callbacks: Function[]

    constructor(props: SlideDownContentProps) {
        super(props)        
        this.callbacks = []
    }

    handleRef = (ref: HTMLDivElement | null) => {
        /* Handle both the internal and forwardedRef and maintain correct typings */
        this.outerRef = ref
        
        if (this.props.forwardedRef) {
            if (typeof this.props.forwardedRef === 'function') {
                this.props.forwardedRef(ref)
            } else if (typeof this.props.forwardedRef === 'object') {
                const forwardedRef = this.props.forwardedRef as any
                forwardedRef.current = ref
            } else {
                throw new Error(`Invalid forwardedRef ${this.props.forwardedRef}`)
            }
        }        
    }

    componentDidMount() {
        if (this.props.closed) {
            this.outerRef.classList.add('closed')
        }
    }

    componentWillAppear(callback: Function) {
        if (this.props.transitionOnAppear) {
            this.callbacks.push(callback)
            this.startTransition('0px')
        } else {
            this.outerRef.style.height = this.props.closed ? '0px' : 'auto'
            callback()
        }
    }

    componentWillEnter(callback: Function) {
        this.callbacks.push(callback)
        const prevHeight = this.outerRef.getBoundingClientRect().height + 'px'
        this.startTransition(prevHeight)
    }

    componentWillLeave(callback: Function) {
        this.callbacks.push(callback)
        this.outerRef.classList.add('transitioning')
        this.outerRef.style.height = getComputedStyle(this.outerRef).height
        this.outerRef.offsetHeight // force repaint
        this.outerRef.style.transitionProperty = 'height'
        this.outerRef.style.height = '0px'
    }

    getSnapshotBeforeUpdate() {
        /* Prepare to resize */
        if (this.callbacks.length === 0) {
            return this.outerRef.getBoundingClientRect().height + 'px'
        } else {
            return null
        }
    }

    componentDidUpdate(_prevProps, _prevState, snapshot: string | null) {
        /* Terminate any active transition */
        const callback = this.callbacks.shift()
        callback && callback()

        if (this.callbacks.length === 0) {
            const prevHeight = snapshot || getComputedStyle(this.outerRef).height
            this.startTransition(prevHeight)
        }
    }

    startTransition(prevHeight: string) {
        let endHeight = '0px'

        if (!this.props.closed) {
            this.outerRef.classList.remove('closed')
            this.outerRef.style.height = 'auto'
            endHeight = getComputedStyle(this.outerRef).height
        }

        if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
            this.outerRef.classList.add('transitioning')
            this.outerRef.style.height = prevHeight
            this.outerRef.offsetHeight // force repaint
            this.outerRef.style.transitionProperty = 'height'
            this.outerRef.style.height = endHeight
        }
    }

    handleTransitionEnd = (evt: React.TransitionEvent) => {
        if ((evt.target === this.outerRef) && (evt.propertyName === 'height')) {
            const callback = this.callbacks.shift()
            callback && callback()

            /* sometimes callback() executes componentWillEnter */
            if (this.callbacks.length === 0) {
                this.outerRef.classList.remove('transitioning')
                this.outerRef.style.transitionProperty = 'none'
                this.outerRef.style.height = this.props.closed ? '0px' : 'auto'

                if (this.props.closed) {
                    this.outerRef.classList.add('closed')
                }
            }
        }
    }

    render() {
        const className = this.props.className ?
            'react-slidedown ' + this.props.className : 'react-slidedown'

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
function TransitionGroupWrapper(props) {
    const childrenArray = React.Children.toArray(props.children)
    return childrenArray[0] || null
}

interface SlideDownProps {
    children?: React.ReactNode
    className?: string
    transitionOnAppear?: boolean
    closed?: boolean
}

export const SlideDown = React.forwardRef((props: SlideDownProps, ref: React.Ref<HTMLDivElement>) => {
    const { children, ...attrs } = props
    const hasContent = (children && React.Children.count(children) !== 0)

    return (
        <TransitionGroup component={TransitionGroupWrapper}>
            {hasContent && <SlideDownContent key={'content'} {...attrs} forwardedRef={ref}>{children}</SlideDownContent>}
        </TransitionGroup>
    )
})


export default SlideDown