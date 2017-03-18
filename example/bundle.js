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
        console.log(React.Children.count(this.props.children));
        return (React.createElement("div", { className: 'react-slidein-wrapper' },
            React.createElement("div", { className: 'react-slidein-content' }, this.props.children)));
    };
    return SlideIn;
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
        return (React.createElement(SlideIn, null, this.props.open && this.renderList()));
    };
    Dropdown.prototype.renderList = function () {
        var count = Math.trunc(Math.random() * this.props.maxItems) + 5;
        var items = [];
        for (var idx = 0; idx < count; idx++)
            items.push(React.createElement("li", { key: idx },
                React.createElement("span", null, 'Item ' + idx)));
        return React.createElement("ul", null, items);
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
            React.createElement(Dropdown, { maxItems: maxItems, open: this.state.open })));
    };
    return Main;
}(React.Component));

ReactDOM.render(React.createElement(Main, null), document.getElementById('main'));

}(React,ReactDOM));
