import Tag from 'element-ui/lib/tag';

import { registerComponent } from '@lcap/nasl-hoc-vue/index';
import * as plugins from './plugins';

export const ElTag = registerComponent(Tag, plugins, {
  nativeEvents: [],
  slotNames: ["default"],
  methodNames: [],
});

export default ElTag;
