/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { ElRadioProps } from './type';
import { PropType } from 'vue';

export default {
  /** 是否允许取消选中 */
  allowUncheck: Boolean,
  /** 是否选中 */
  checked: Boolean,
  /** 是否选中，非受控属性 */
  defaultChecked: Boolean,
  /** 单选按钮内容，同 label */
  default: {
    type: [String, Function] as PropType<ElRadioProps['default']>,
  },
  /** 是否为禁用态 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 主文案 */
  label: {
    type: [String, Function] as PropType<ElRadioProps['label']>,
  },
  /** HTML 元素原生属性 */
  name: {
    type: String,
    default: '',
  },
  /** 单选按钮的值 */
  value: {
    type: [String, Number, Boolean] as PropType<ElRadioProps['value']>,
    default: undefined,
  },
  /** 选中状态变化时触发 */
  onChange: Function as PropType<ElRadioProps['onChange']>,
  /** 点击时触发，一般用于外层阻止冒泡场景 */
  onClick: Function as PropType<ElRadioProps['onClick']>,
};
