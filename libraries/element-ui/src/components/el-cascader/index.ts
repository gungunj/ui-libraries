import Cascader from 'element-ui/lib/cascader';
import CascaderPanel from 'element-ui/lib/cascader-panel';
import { registerComponent } from '@lcap/nasl-hoc-vue/index';
import * as plugins from './plugins';

export const ElCascader = registerComponent(Cascader, plugins, {
  nativeEvents: [],
  slotNames: ['default', 'empty'],
  methodNames: ['getCheckedNodes'],
});
export const ElCascaderPanel = CascaderPanel;

export default ElCascader;
