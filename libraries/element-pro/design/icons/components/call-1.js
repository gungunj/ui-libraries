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
      "d": "M16.05 1.79l.97.26a7 7 0 014.93 4.93l.26.97-1.93.52-.26-.97a5 5 0 00-3.52-3.52l-.97-.26.52-1.93zM1 2h8.58l1.49 6.7-1.86 1.85c1.09 1.7 2.54 3.15 4.24 4.24l1.86-1.86L22 14.42V23h-1a19.91 19.91 0 01-16.8-9.15A19.91 19.91 0 011 3V2zm2.03 2a17.9 17.9 0 008.2 14.12A17.9 17.9 0 0020 20.97v-4.95l-4.05-.9-2.18 2.18-.66-.38a16.07 16.07 0 01-6.03-6.03l-.38-.66 2.18-2.18L7.98 4H3.03zm12.1 1.17l.97.26a3.5 3.5 0 012.47 2.46l.26.97-1.93.52-.26-.97a1.5 1.5 0 00-1.06-1.05l-.96-.26.52-1.93z"
    }
  }]
};
var Call1 = Vue.extend({
  name: "Call1Icon",
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
      id: "call-1",
      icon: element,
      staticClass: className,
      style: style
    });
    data.props = fullProps;
    return createElement(IconBase, data);
  }
});

export default Call1;
//call-1.js.map
