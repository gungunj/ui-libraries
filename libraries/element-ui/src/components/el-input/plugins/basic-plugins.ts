/* eslint-disable no-shadow */
/* 组件功能扩展插件 */
// export { useVModelSync } from '@lcap/nasl-hoc-vue/index';
import { computed, watch, ref } from '@vue/composition-api';

export function handleDataSource(
  { props, store },
  {
    commit, dfineAction, dispatch, emit, expose,
  },
) {
  // 自由逻辑变化
  // watch(
  //   () => props.dataSource,
  //   () => {
  //     const dataSource = fetch('xxx');
  //     commit({ dataSource });
  //     dispatch('dataSourceMapField');
  //   },
  // );

  // 派生逻辑变化
  dfineAction('dataSourceMapField', ({ props, state }, { commit }) => {
    const { textField, valueField } = props;
    const { dataSource } = state;
    const result = dataSource.map((item) => {
      return {
        label: item[textField],
        value: item[valueField],
      };
    });
    commit({ dataSource: result });
  });

  return {
    // listeners({ onChange }) {
    //   return {
    //     onChange: () => onChange(),
    //   };
    // },
    render(h, baseComponent) {
      console.log(baseComponent, 'base');
      return h(baseComponent, {

      });
    },
    // slot() {
    //   return {
    //     slotDefault: () => {},
    //     slotxxx: () => {},
    //   };
    // },
    // ref: {
    //   getSelection: () => {},
    // },
  };
}

export function handleValueAndTextFiled({ props, store }, { dispatch }) {
  // watch([props.valueField, props.textField], () => {
  //   dispatch('dataSourceMapField');
  // });
}
