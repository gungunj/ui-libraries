/// <reference types="@nasl/types" />

namespace nasl.ui {
  @IDEExtraInfo({
    show: false,
  })
  @Component({
    title: '结果',
    icon: 'result',
    description: '用于对用户的操作结果或者异常状态做反馈。',
    group: 'Display',
  })
  export class ElResult extends ViewComponent {
    constructor(options?: Partial<ElResultOptions>) {
      super();
    }
  }

  export class ElResultOptions extends ViewComponentOptions {
    @Prop({
      group: '主要属性',
      title: '标题',
      description: '标题',
      setter: { concept: 'InputSetter' },
    })
    title: nasl.core.String;

    @Prop({
      group: '主要属性',
      title: '二级标题',
      description: '二级标题',
      setter: { concept: 'InputSetter' },
    })
    subTitle: nasl.core.String;

    @Prop({
      group: '主要属性',
      title: '图标类型',
      description: '图标类型',
      setter: {
        concept: 'EnumSelectSetter',
        options: [
          { title: 'success' },
          { title: 'warning' },
          { title: 'info' },
          { title: 'error' },
        ],
      },
    })
    icon: 'success' | 'warning' | 'info' | 'error' = 'info';

    @Slot({
      title: '图标',
      description: '自定义图标',
    })
    slotIcon: () => Array<ViewComponent>;

    @Slot({
      title: '标题',
      description: '自定义标题',
    })
    slotTitle: () => Array<ViewComponent>;

    @Slot({
      title: '二级标题',
      description: '自定义二级标题',
    })
    slotSubTitle: () => Array<ViewComponent>;

    @Slot({
      title: '底部额外区域',
      description: '自定义底部额外区域',
    })
    slotExtra: () => Array<ViewComponent>;
  }
}
