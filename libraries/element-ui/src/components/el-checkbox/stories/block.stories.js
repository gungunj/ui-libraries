import ElCheckbox from '../index';

export default {
  id: 'el-checkbox-blocks',
  title: '组件列表/CHECKBOX 多选框/内置区块',
  component: ElCheckbox,
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
      template: '<div style="width: 500px;"><story/></div>',
    }),
  ],
};

export const Default = {
  name: '基础示例',
  render: () => ({
    template: '<el-checkbox></el-checkbox>',
  }),
};
