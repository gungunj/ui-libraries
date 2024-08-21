import Input from 'element-ui/lib/input';
import Autocomplete from 'element-ui/lib/autocomplete';
// import { registerComponent } from '@lcap/nasl-hoc-vue/index';
import { registerComponent } from '../../sr-plugins/index';
import * as plugins from './plugins';

console.log(plugins, '==');
export const ElInput = registerComponent(Input, plugins, {
  nativeEvents: [],
  slotNames: ['prefix', 'suffix', 'prepend', 'append', 'default'],
  methodNames: ['focus', 'blur', 'select'],
});
export const ElAutocomplete = Autocomplete;

export default ElInput;
