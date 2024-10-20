import { Textarea } from '@element-pro';
import { registerComponent } from '@lcap/vue2-utils';
import * as plugins from './plugins';
import './index.less';

export const ElTextareaPro = registerComponent(Textarea, plugins, {
  nativeEvents: [],
  slotNames: [],
  methodNames: [],
  model: {
    prop: 'value',
    event: 'update:value',
  },
});

export default ElTextareaPro;
