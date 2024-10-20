import ElInputNumberPro from '../index';

export default {
  id: 'el-input-number-pro-blocks',
  title: '组件列表/InputNumber 数字输入框/内置区块',
  component: ElInputNumberPro,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  decorators: [
    () => ({
      provide() {
        return {
          VUE_APP_DESIGNER: true,
        };
      },
      template: '<div ><story/></div>',
    }),
  ],
};

export const Default = {
  name: '基础示例',
  render: () => ({
    template: '<el-input-number-pro theme="column"></el-input-number-pro>',
  }),
};
