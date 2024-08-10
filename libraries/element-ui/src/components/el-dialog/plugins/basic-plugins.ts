/* 组件功能扩展插件 */
import type { NaslComponentPluginOptions, Slot } from '@lcap/nasl-hoc-vue/plugin';
import { isNullOrUndefined } from '../../../plugins/utils';
import { $ref } from '@lcap/nasl-hoc-vue/index';
export const useDialog: NaslComponentPluginOptions = {
    setup: (props) => {
        // 同时响应外部  visible属性设置的变化
        const opened = props.useRef('visible', (v) => (isNullOrUndefined(v) ? false : true));

        return {
        'visible': opened,
        [$ref]: {
            // 外部可以读取 visible
            props: ['visible'],
            // ide 内使用
            designerControl() {
            opened.value = !opened;
            },
            open: () => {
            opened.value = true;
            },
            close: () => {
            opened.value = false;
            }
        }
        };
    },
    order: 1
};

export const useEvents = {
    setup: (props) => {
      return {
        beforeClose: (done) => {
          const onBeforeClose = props.get('onBeforeClose');
          if (typeof onBeforeClose === 'function') {
            onBeforeClose(done);
          }
        },

      };
    },
    order: 2,
  }
