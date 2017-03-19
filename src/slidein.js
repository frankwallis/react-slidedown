import React from 'react'
//import ReactTransitionGroup from 'react-addons-transition-group'
const ReactTransitionGroup = React.addons.TransitionGroup;
export class SlideIn extends React.Component {

    render() {
        const open = (this.props.children && React.Children.count(this.props.children) !== 0)
        const className = this.props.className ? 'react-slidein ' + this.props.className : 'react-slidein';

        console.log('open', open, this.props.children, React.Children.count(this.props.children));

        return (
            <ReactTransitionGroup {...this.props} className={className} component={'div'}>
                {open &&
                    <SlideInContent key={'counter'}>
                        {this.props.children}
                    </SlideInContent>
                }
            </ReactTransitionGroup>
        );
    }
}
const entered = 0;
const left = 0;

class SlideInContent extends React.Component {
    handleRef = (element) => {
        this.element = element;
        this.callbacks = [];
    }

    componentWillEnter(callback) {
        //console.log('entering', 'entered', entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
        this.callbacks.push(callback);
        const prevHeight = this.element.style.height
        this.element.style.height = 'auto'
        const endHeight = getComputedStyle(this.element).height
        this.element.style.height = prevHeight
        this.element.offsetHeight // force repaint
        this.element.style.transitionProperty = 'height'
        this.element.style.height = endHeight
        //console.log('entered', 'entered', ++entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
    }

    componentWillLeave(callback) {
        //console.log('leaving', 'entered', entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
        this.callbacks.push(callback);
        this.element.style.height = getComputedStyle(this.element).height
        this.element.style.transitionProperty = 'height'
        this.element.offsetHeight // force repaint
        this.element.style.height = '0'
        //console.log('left', 'entered', entered, 'left', ++left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
    }

    handleTransitionEnd = (evt) => {
        //console.log('transitionEnd', 'entered', entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);

        if (evt && evt.target !== this.element) {
            console.log('breaking')
            return;
        }

        if (evt.propertyName == 'height') {
            //console.log('before callback', 'entered', entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
            const callback = this.callbacks.shift();
            callback();

            if (this.callbacks.length === 0) {
                this.element.style.transitionProperty = 'none'
                this.element.style.height = 'auto';
            }
            //console.log('after callback', 'entered', entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
        }

        //console.log('after transitionEnd', 'entered', entered, 'left', left, 'unmounted', this.unmounted, 'callbacks', this.callbacks && this.callbacks.length);
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
