import ElCheckboxPro from '../index';

export default {
  id: 'el-checkbox-pro-blocks',
  title: '组件列表/Checkbox 多选框/内置区块',
  component: ElCheckboxPro,
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
    template: '<el-checkbox-group-pro><el-checkbox-pro><el-text text="多选项"></el-text></el-checkbox-pro></el-checkbox-group-pro>',
  }),
};

export const DataSource = {
  name: '使用数据源',
  render: () => ({
    template: `
      <el-checkbox-group-pro :dataSource="[{}]"></el-checkbox-group-pro>
    `,
  }),
};
