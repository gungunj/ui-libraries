import { _ as _defineProperty } from '../_chunks/dep-a77ab85e.js';
import { _ as _objectWithoutProperties } from '../_chunks/dep-0acb3ad3.js';
import Vue from 'vue';
import IconBase from '../icon.js';
import useSizeProps from '../utils/use-size-props.js';
import 'classnames';
import '../utils/use-common-classname.js';
import '../utils/config-context.js';

var _excluded = ["size"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var element = {
  "tag": "svg",
  "attrs": {
    "fill": "none",
    "viewBox": "0 0 24 24",
    "width": "1em",
    "height": "1em"
  },
  "children": [{
    "tag": "path",
    "attrs": {
      "fill": "currentColor",
      "d": "M12 23a11 11 0 100-22 11 11 0 000 22zm-.17-11.11c.43-.53.97-.97 1.4-1.32A2 2 0 0012 7a2 2 0 00-1.89 1.33l-.33.95L7.9 8.6l.34-.94a4 4 0 116.24 4.47 7 7 0 00-1.1 1.01c-.27.34-.37.61-.37.85v1.25h-2V14c0-.87.39-1.57.83-2.11zM11 18.25v-2h2v2h-2z"
    }
  }]
};
var HelpCircleFilled = Vue.extend({
  name: "HelpCircleFilledIcon",
  functional: true,
  props: {
    size: {
      type: String
    },
    onClick: {
      type: Function
    }
  },
  render: function render(createElement, context) {
    var props = context.props,
      data = context.data;
    var size = props.size,
      otherProps = _objectWithoutProperties(props, _excluded);
    var _useSizeProps = useSizeProps(size),
      className = _useSizeProps.className,
      style = _useSizeProps.style;
    var fullProps = _objectSpread(_objectSpread({}, otherProps || {}), {}, {
      id: "help-circle-filled",
      icon: element,
      staticClass: className,
      style: style
    });
    data.props = fullProps;
    return createElement(IconBase, data);
  }
});

export default HelpCircleFilled;
//help-circle-filled.js.map
