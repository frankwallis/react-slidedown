(function (React,ReactDOM) {
'use strict';

React = 'default' in React ? React['default'] : React;
ReactDOM = 'default' in ReactDOM ? ReactDOM['default'] : ReactDOM;

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var ReactTransitionGroup = React.addons.TransitionGroup;
var SlideIn = (function (_super) {
    __extends$2(SlideIn, _super);
    function SlideIn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlideIn.prototype.render = function () {
        var open = (this.props.children && React.Children.count(this.props.children) !== 0);
        var className = this.props.className ? 'react-slidein ' + this.props.className : 'react-slidein';
        console.log('open', open, this.props.children, React.Children.count(this.props.children));
        return (React.createElement(ReactTransitionGroup, __assign({}, this.props, { className: className, component: 'div' }), open &&
            React.createElement(SlideInContent, { key: 'counter' }, this.props.children)));
    };
    return SlideIn;
}(React.Component));
var SlideInContent = (function (_super) {
    __extends$2(SlideInContent, _super);
    function SlideInContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleRef = function (element) {
            _this.element = element;
            _this.callbacks = [];
        };
        _this.handleTransitionEnd = function (evt) {
            if (evt && evt.target !== _this.element) {
                console.log('breaking');
                return;
            }
            if (evt.propertyName == 'height') {
                var callback = _this.callbacks.pop();
                callback();
                if (_this.callbacks.length === 0) {
                    _this.element.style.transitionProperty = 'none';
                    _this.element.style.height = 'auto';
                }
            }
            else {
                console.log('wrong transition');
            }
        };
        return _this;
    }
    SlideInContent.prototype.componentWillEnter = function (callback) {
        this.callbacks.push(callback);
        var prevHeight = this.element.style.height;
        this.element.style.height = 'auto';
        var endHeight = getComputedStyle(this.element).height;
        this.element.style.height = prevHeight;
        this.element.offsetHeight;
        this.element.style.transitionProperty = 'height';
        this.element.style.height = endHeight;
    };
    SlideInContent.prototype.componentWillLeave = function (callback) {
        this.callbacks.push(callback);
        this.element.style.height = getComputedStyle(this.element).height;
        this.element.style.transitionProperty = 'height';
        this.element.offsetHeight;
        this.element.style.height = '0';
    };
    SlideInContent.prototype.render = function () {
        return (React.createElement("div", { className: 'react-slidein-content', ref: this.handleRef, onTransitionEnd: this.handleTransitionEnd }, this.props.children));
    };
    return SlideInContent;
}(React.Component));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dropdown = (function (_super) {
    __extends$1(Dropdown, _super);
    function Dropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dropdown.prototype.render = function () {
        var className = 'dropdown-slidein';
        var caption = this.props.open ? 'Down' : 'Up';
        if (this.props.overlay) {
            className = 'dropdown-slidein overlay';
            caption = this.props.open ? 'Open' : 'Closed';
        }
        return (React.createElement("div", { className: 'dropdown-container' },
            React.createElement("span", null, caption),
            React.createElement(SlideIn, { className: className }, this.props.open && this.renderList())));
    };
    Dropdown.prototype.renderList = function () {
        var count = Math.trunc(Math.random() * this.props.maxItems) + 5;
        var items = [];
        for (var idx = 0; idx < count; idx++)
            items.push(React.createElement("li", { key: idx },
                React.createElement("span", null, 'Item ' + idx)));
        return React.createElement("ul", { className: 'dropdown-list' }, items);
    };
    return Dropdown;
}(React.Component));

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main = (function (_super) {
    __extends(Main, _super);
    function Main(props) {
        var _this = _super.call(this, props) || this;
        _this.handleToggle = function () {
            _this.setState(function (state) { return ({ open: !state.open }); });
        };
        _this.state = { open: false };
        return _this;
    }
    Main.prototype.render = function () {
        return (React.createElement("div", { className: 'main-container' },
            React.createElement("button", { className: 'main-toggle', onClick: this.handleToggle }, "Toggle"),
            React.createElement("div", { className: 'main-columns' },
                this.renderColumn(10, false),
                this.renderColumn(20, true),
                this.renderColumn(30, false),
                this.renderColumn(40, true))));
    };
    Main.prototype.renderColumn = function (maxItems, overlay) {
        return (React.createElement("div", { className: 'main-column' },
            React.createElement("span", null, 'I will ' + (overlay ? 'overlay' : 'push down')),
            React.createElement(Dropdown, { maxItems: maxItems, open: this.state.open, overlay: overlay }),
            React.createElement("span", null, 'I am ' + (overlay ? 'underneath' : 'below'))));
    };
    return Main;
}(React.Component));

ReactDOM.render(React.createElement(Main, null), document.getElementById('main'));

}(React,ReactDOM));
