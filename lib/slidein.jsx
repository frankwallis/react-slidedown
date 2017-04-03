import * as React from 'react'
import * as ReactTransitionGroup from 'react-addons-transition-group'

class SlideInContent extends React.Component {
    handleRef = (element) => {
        this.element = element
        this.callbacks = []
    }

    componentWillEnter(callback) {
        this.callbacks.push(callback)
        const prevHeight = this.element.getBoundingClientRect().height + 'px'
        this.element.style.height = 'auto'
        const endHeight = getComputedStyle(this.element).height
        this.element.classList.add('transitioning')
        this.element.style.height = prevHeight
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = endHeight
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
            var prevHeight = getComputedStyle(this.element).height;
            this.element.style.height = 'auto';
            var endHeight = getComputedStyle(this.element).height;

            if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
                this.element.classList.add('transitioning');
                this.element.style.height = prevHeight;
                this.element.offsetHeight;
                this.element.style.transitionProperty = 'height';
                this.element.style.height = endHeight;
            }
            else {
                this.element.style.height = 'auto'
            }
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
function SlideInWrapper(props) {
    const childrenArray = React.Children.toArray(props.children)
    return childrenArray[0] || null
}

export function SlideIn(props) {
    const { children, ...attrs } = props;
    const open = (children && React.Children.count(children) !== 0)

    return (
        <ReactTransitionGroup component={SlideInWrapper}>
            {open && <SlideInContent key={'content'} {...attrs}>{children}</SlideInContent>}
        </ReactTransitionGroup>
    );
}
