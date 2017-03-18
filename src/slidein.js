import React from 'react'

export class SlideIn extends React.Component {

    render() {
        const open = (this.props.children && React.Children.count(this.props.children) !== 0)

        const classList = ['react-slidein']
        if (open) classList.push('open')

        return (
            <div className={classList.join(' ')}>
                { open && 
                    <SlideInContent>
                        {this.props.children}
                    </SlideInContent>
                }
            </div>
        );
    }
}

class SlideInContent extends React.Component {
    handleRef = (element) => {
        if (element) {
            var prevHeight = element.style.height
            element.style.height = 'auto'
            var endHeight = getComputedStyle(element).height
            element.style.height = prevHeight
            element.offsetHeight // force repaint
            element.style.transitionProperty = 'height'
            element.style.height = endHeight
        }
        else {
            this.element.style.height = getComputedStyle(this.element).height
            this.element.style.transitionProperty = 'height'
            this.element.offsetHeight // force repaint
            this.element.style.height = '0'
        }
        this.element = element;
    }

    handleTransitionEnd = (evt) => {
        console.log(evt.propertyName)
        if (evt.propertyName == 'height') {
            this.element.style.height = 'auto'
            this.element.style.transitionProperty = 'none'
        }
    }

    componentWillUnmount() {
        this.element.style.height = getComputedStyle(this.element).height
        console.log('height', this.element.style.height)
        this.element.style.transition = 'height .5s ease-in-out'
        this.element.offsetHeight // force repaint
        this.element.style.height = '0'        
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
