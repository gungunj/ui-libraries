/* eslint-disable no-param-reassign */
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { uid } from 'uid';
import type { ComponentOptions } from 'vue';
import create from 'zustand-vue';
import type {
  NaslComponentPluginOptions,
  PluginMap,
  PluginSetupFunction,
} from './plugin';
import PluginManager from './plugin';
import HocBaseComponent, { NaslComponentExtendInfo } from './hoc-base';

export { $deletePropList, $ref, $render } from './constants';
export * from './common';

Vue.use(VueCompositionAPI);

export const registerComponent = (
  baseComponent: any,
  pluginOption: PluginMap,
  { slotNames, nativeEvents, methodNames }: NaslComponentExtendInfo = {
    slotNames: ['default'],
    nativeEvents: [],
    methodNames: [],
  },
) => {
  if (!slotNames) {
    slotNames = ['default'];
  }

  if (!nativeEvents) {
    nativeEvents = [];
  }

  if (!methodNames) {
    methodNames = [];
  }
  let commit: any;
  const useBearStore = create((set) => {
    commit = set;
    return {
      disabled: false,
      name: 'bear',
    };
  });
  return {
    name: baseComponent.name,
    inheritAttrs: false,
    props: {
      plugin: {},
    },
    data() {
      return {
        renderKey: uid(),
        // sotre: useBearStore(),
      };
    },
    created() {
      const self = this as any;
      self.manger = new PluginManager({
        name: baseComponent.name,
        plugin: { ...pluginOption, ...self.plugin },
      });
    },
    computed: {
      sotre() {
        return useBearStore();
      },
    },
    watch: {
      plugin(v) {
        const self = this as any;
        self.manger.setPlugin(v);
        // 重新生成key rerender 组件
        this.renderKey = uid();
      },
      // sotre: {
      //   handler(v) {
      //     console.log(v, 'storeee');
      //   },
      //   deep: true,
      // },
    },
    render(h) {
      const self = this as any;

      return h(HocBaseComponent, {
        key: self.renderKey,
        props: {
          $plugin: self.manger,
          $component: baseComponent,
          $slotNames: slotNames,
          $nativeEvents: nativeEvents,
          $methodNames: methodNames,
          $_slots: self.$scopedSlots,
          $store: this.sotre,
          $commit: commit,
        },
        attrs: self.$attrs,
        scopedSlots: self.$scopedSlots,
        on: self.$listeners,
      });
    },
  } as ComponentOptions<Vue>;
};

export { NaslComponentPluginOptions, PluginSetupFunction };
