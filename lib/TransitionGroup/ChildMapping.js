"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function getChildMapping(children) {
    if (!children) {
        return children;
    }
    var result = {};
    react_1.Children.map(children, function (child) { return child; })
        .forEach(function (child) {
        result[child.key] = child;
    });
    return result;
}
exports.getChildMapping = getChildMapping;
function mergeChildMappings(prev, next) {
    prev = prev || {};
    next = next || {};
    function getValueForKey(key) {
        if (next.hasOwnProperty(key)) {
            return next[key];
        }
        return prev[key];
    }
    var nextKeysPending = {};
    var pendingKeys = [];
    for (var prevKey in prev) {
        if (next.hasOwnProperty(prevKey)) {
            if (pendingKeys.length) {
                nextKeysPending[prevKey] = pendingKeys;
                pendingKeys = [];
            }
        }
        else {
            pendingKeys.push(prevKey);
        }
    }
    var i;
    var childMapping = {};
    for (var nextKey in next) {
        if (nextKeysPending.hasOwnProperty(nextKey)) {
            for (i = 0; i < nextKeysPending[nextKey].length; i++) {
                var pendingNextKey = nextKeysPending[nextKey][i];
                childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
            }
        }
        childMapping[nextKey] = getValueForKey(nextKey);
    }
    for (i = 0; i < pendingKeys.length; i++) {
        childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }
    return childMapping;
}
exports.mergeChildMappings = mergeChildMappings;
//# sourceMappingURL=ChildMapping.js.map