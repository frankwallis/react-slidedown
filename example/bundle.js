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
var SlideIn = (function (_super) {
    __extends$2(SlideIn, _super);
    function SlideIn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlideIn.prototype.render = function () {
        var open = (this.props.children && React.Children.count(this.props.children) !== 0);
        var classList = ['react-slidein'];
        if (open)
            classList.push('open');
        return (React.createElement("div", { className: classList.join(' ') }, open &&
            React.createElement(SlideInContent, null, this.props.children)));
    };
    return SlideIn;
}(React.Component));
var SlideInContent = (function (_super) {
    __extends$2(SlideInContent, _super);
    function SlideInContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleRef = function (element) {
            if (element) {
                var prevHeight = element.style.height;
                element.style.height = 'auto';
                var endHeight = getComputedStyle(element).height;
                element.style.height = prevHeight;
                element.offsetHeight;
                element.style.transitionProperty = 'height';
                element.style.height = endHeight;
            }
            else {
                _this.element.style.height = getComputedStyle(_this.element).height;
                _this.element.style.transitionProperty = 'height';
                _this.element.offsetHeight;
                _this.element.style.height = '0';
            }
            _this.element = element;
        };
        _this.handleTransitionEnd = function (evt) {
            console.log(evt.propertyName);
            if (evt.propertyName == 'height') {
                _this.element.style.height = 'auto';
                _this.element.style.transitionProperty = 'none';
            }
        };
        return _this;
    }
    SlideInContent.prototype.componentWillUnmount = function () {
        this.element.style.height = getComputedStyle(this.element).height;
        console.log('height', this.element.style.height);
        this.element.style.transition = 'height .5s ease-in-out';
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
        return (React.createElement("div", { className: 'dropdown-container' },
            React.createElement("span", null, this.props.open ? 'Open' : 'Closed'),
            React.createElement(SlideIn, null, this.props.open && this.renderList())));
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
                this.renderColumn(10),
                this.renderColumn(20),
                this.renderColumn(30),
                this.renderColumn(40))));
    };
    Main.prototype.renderColumn = function (maxItems) {
        return (React.createElement("div", { className: 'main-column' },
            React.createElement("span", null, "I am above"),
            React.createElement(Dropdown, { maxItems: maxItems, open: this.state.open }),
            React.createElement("span", null, "I am below")));
    };
    return Main;
}(React.Component));

ReactDOM.render(React.createElement(Main, null), document.getElementById('main'));

}(React,ReactDOM));
