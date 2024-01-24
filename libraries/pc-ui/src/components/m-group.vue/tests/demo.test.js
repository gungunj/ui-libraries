/* 自动生成测试文件， 后面可删除，不可增加 */
import {
  describe,
  it,
  expect,
} from 'vitest';
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

import CasesDemo1 from '../demos/cases/CasesDemo1.vue';
import ExamplesDemo1 from '../demos/examples/ExamplesDemo1.vue';

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(() => resolve(true), ms);
});

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('m-group.vue', () => {
  it('Demo-分组', async () => {
    const wrapper = mount(CasesDemo1, { localVue, router });
    await sleep(16);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Demo-分组', async () => {
    const wrapper = mount(ExamplesDemo1, { localVue, router });
    await sleep(16);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
