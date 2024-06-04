// Utils
import { sync } from '@lcap/vue2-utils';
import { createNamespace, _get, isObject } from '../utils';
import Picker from './Picker';
import Popup from '../popup';
import Field from '../field';
import Search from '../search';
import List from './List';

import { FieldMixin } from '../mixins/field';
import DataSourceMixin from '../mixins/DataSource';
import { EmptyCol } from '../emptycol';
import { EventSlotCommandProvider } from '../mixins/EventSlotCommandProvider';
import PreviewMixin from "../mixins/preview";
import DataSource from '../utils/DataSource';

const [createComponent, bem, t] = createNamespace('pickerson');

const EventSlotCommandMap = {
  cancel: 'onCancel',
  confirm: 'onConfirm',
};

export default createComponent({
  mixins: [
    FieldMixin,
    DataSourceMixin,
    EventSlotCommandProvider(EventSlotCommandMap),
    PreviewMixin,
    sync({
      value: 'currentValue',
      data: 'data',
      size() {
        return this.currentDataSource && this.currentDataSource.size ? this.currentDataSource.paging.size : this.pageSize;
      },
      page() {
        return this.currentDataSource && this.currentDataSource.paging ? this.currentDataSource.paging.number : this.pageNumber;
      },
      filterText: 'filterText',
    }),
  ],
  props: {
    readonly: Boolean,
    disabled: Boolean,
    columnsprop: [Array, String],
    pvalue: [String, Object], // 废弃
    value: [String, Object],
    labelField: {
      type: String,
      default: '',
    },
    inputAlign: String,
    closeOnClickOverlay: Boolean,
    showToolbar: Boolean,
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    title: {
      type: String,
      default: '标题',
    },
    confirmButtonText: {
      type: String,
      default: '确认',
    },
    multiple: Boolean,
    enableSelectAll: Boolean,
    enableSelectedCount: Boolean,
    type: {
      type: String,
      default: 'picker',
      validator(value) {
        return ['picker', 'list'].includes(value);
      },
    },
    placeholder: {
      type: String,
      default: '请选择',
    },

    pageable: { type: [Boolean, String], default: false },
    filterable: { type: Boolean, default: false },
    sorting: Object,

    isNew: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      popupVisible: false,
      // 内部值
      currentValue: this.formatValue((this.value ?? this.pvalue) || ''),
      style: '',

      // 当前选中的值对应的数据
      currentSelected: [],
    };
  },
  mounted() {
    this.style = `font-size: ${this.$el.style.fontSize || '16px'};`;
  },
  computed: {
    data() {
      return this.currentData || this.columnsprop || [];
    },
  },
  watch: {
    currentValue(val) {
      this.updateSelected(val);
    },
    // 监听props变化
    value(val) {
      this.currentValue = this.formatValue(val);
    },
    pvalue(val) {
      this.currentValue = this.formatValue(val);
    },
  },

  methods: {
    designerOpen(e) {
      let currentElement = e.target;
      let nodePath = false;
      while (currentElement) {
        const np = currentElement.getAttribute('vusion-node-path');
        if (np) {
          nodePath = np;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      if (this?.$attrs?.['vusion-node-path'] === nodePath) {
        this.$refs.popup.togglePModal();
      }
    },
    designerClose() {
      // readme:ide会记录通过designerDbControl打开的浮窗，需要通过该命令清除，在触发方式双击变单击后，暂无作用
      if (window.parent && this?.$attrs?.['vusion-node-path']) {
        window.parent?.postMessage(
          {
            protocol: 'vusion',
            sender: 'helper',
            type: 'send',
            command: 'setPopupStatusInfo',
            args: [
              {
                nodePath: this?.$attrs?.['vusion-node-path'],
                visible: false,
              },
            ],
          },
          '*'
        );
      }
      this.$refs.popup.togglePModal();
    },
    formatValue(value) {
      let val = value;
      if (this.multiple && !Array.isArray(value)) {
        val = [value].filter((item) => {
          if (item !== null || item !== undefined || item !== '') {
            return false;
          }

          return true;
        });
      } else if (!this.multiple && Array.isArray(value)) {
        val = value[0];
      }
      return val;
    },
    async updateSelected(value) {
      // 遍历data
      const iterateData = (data, callback) => {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          let v, t;
          if (isObject(item)) {
            v = _get(item, this.valueField);
            t = _get(item, this.textField);
          } else {
            v = item;
            t = item;
          }
          callback({ value: v, text: t });
        }
      };

      let selected = [];
      const dataMap = {};
      const data = this.currentDataSource?.data || [];

      iterateData(data, (item) => {
        dataMap[item.value] = item;
      })

      let val = Array.isArray(value) ? value : [value];
      let filterValue = [];
      for (let i = 0; i < val.length; i++) {
        const v = val[i];
        if (dataMap[v]) {
          selected.push(dataMap[v]);
        } else {
          filterValue.push(v);
        }
      }

      if (this.currentDataSource) {
        const res = await this.currentDataSource._load({ filterValue });
        if (Array.isArray(res)) {
          iterateData(res, (item) => {
            selected.push(item);
          })

        } else if (isObject(res)) {
          iterateData(res.data || [], (item) => {
            selected.push(item);
          })
        }
      }

      this.currentSelected = selected;
    },
    getTitle() {
      if (this.inDesigner()) {
        return this.value ?? this.pvalue;
      }

      return this.currentSelected.map((item) => item.text).join('，');
    },
    togglePopup() {
      this.popupVisible = !this.popupVisible;
    },
    closePopup() {
      this.popupVisible = false;
    },
    normalizeDataSource(dataSource) {
      const options = this.getDataSourceOptions();
      if (dataSource instanceof DataSource) return dataSource;
      // 数组
      if (dataSource instanceof Array) {
        options.data = Array.from(dataSource);

        return new DataSource(options);
      }
      if (dataSource instanceof Function) {
        const self = this;
        // 构造load函数
        options.load = function load(params) {
          self.$emitSyncParams(params);
          const result = dataSource(params);
          if (result instanceof Promise)
            return result.catch(() => (this.currentLoading = false));

          return Promise.resolve(result);
        };

        return new DataSource(options);
      }
      if (dataSource instanceof Object) {
        if (dataSource.hasOwnProperty('list') && Array.isArray(dataSource.list))
          return new DataSource(
            Object.assign(options, dataSource, {
              data: dataSource.list,
            })
          );
        return new DataSource(Object.assign(options, dataSource));
      }
      return undefined;
    },
    onChange(vm, val, index) {
      this.$emit('change', vm, val, index);
    },
    onConfirm() {
      this.$refs?.picker?.stopMomentum?.();
      const [value, index] = this.$refs?.picker?.getValue();

      this.currentValue = value;
      this.closePopup();

      this.$emit('update:value', value);
      this.$emit('update:pvalue', value);
      this.$emit('confirm', value, index);
    },
    onCancel() {
      this.$emit('cancel');
      this.closePopup();
    },
    onScrollToLower() {
      console.log('到底了');
      // 不分页
      if (!this.pageable) return;
      // 加载中
      if (this.currentLoading) return;

      if (this.currentDataSource && this.currentDataSource.hasMore()) {
        this.debouncedLoad(true);
      }
    },
    genToolBar() {
      if (this.isNew) {
        let topSlot = this.slots('picker-top');
        let titleSlot = this.slots('pannel-title');
        if (this.inDesigner()) {
          if (!topSlot) {
            topSlot = <EmptyCol></EmptyCol>;
          }
          if (!titleSlot) {
            titleSlot = <EmptyCol></EmptyCol>;
          }
        }
        return (
          <div class={bem('picker-top')}>
            {topSlot && (
              <div
                vusion-slot-name="picker-top"
                style="display:flex; justify-content: space-between; align-items: center; min-height:32px;"
              >
                {topSlot}
              </div>
            )}
            <div
              style="position:absolute; top: 50%; left:50%; transform: translate(-50%,-50%);"
              vusion-slot-name="pannel-title"
            >
              {titleSlot || this.title}
            </div>
          </div>
        );
      }

      if (!this.showToolbar) {
        return null;
      }

      return (
        <div class={bem('toolbar')}>
          <button type="button" class={bem('cancel')} onClick={this.onCancel}>
            {this.cancelButtonText || t('cancel')}
          </button>
          {this.title && (
            <div class={['van-ellipsis', bem('title')]}>{this.title}</div>
          )}
          <button type="button" class={bem('confirm')} onClick={this.onConfirm}>
            {this.confirmButtonText || t('confirm')}
          </button>
        </div>
      );
    },

    onClickField() {
      if (this.readonly || this.disabled) {
        return;
      }

      this.togglePopup();
    },

    renderBottom() {
      if (!this.isNew) return null;

      let bottomSlot = this.slots('picker-bottom');
      if (this.inDesigner()) {
        if (!bottomSlot) {
          bottomSlot = <EmptyCol></EmptyCol>;
        }
      }

      if (!bottomSlot) return null;

      return (
        <div vusion-slot-name="picker-bottom" class={bem('picker-bottom')}>
          {bottomSlot}
        </div>
      );
    },
  },

  render(h) {
    const tempSlot = {
      title: () => this.slots('title'),
    };

    const on = {
      ...this.$listeners,
      change: this.onChange,
      confirm: this.onConfirm,
      cancel: this.onCancel,
      scrolltolower: this.onScrollToLower,
    };

    if (this.isPreview) {
      return (
        <div class={bem('wrap')} vusion-click-enabled="true">
          <Field
            label={this.labelField}
            value={this.getTitle() || '--'}
            scopedSlots={tempSlot}
            readonly
            isLink
            input-align={this.inputAlign || 'right'}
            // eslint-disable-next-line no-prototype-builtins
            notitle={!this.$slots.hasOwnProperty('title')}
            insel={true}
          />
        </div>
      );
    }

    return (
      <div class={bem('wrap')} vusion-click-enabled="true">
        <Field
          label={this.labelField}
          value={this.getTitle()}
          placeholder={this.placeholder}
          scopedSlots={tempSlot}
          readonly
          disabled={this.disabled}
          isLink
          input-align={this.inputAlign || 'right'}
          onClick={this.inDesigner() ? this.designerOpen : this.onClickField}
          // eslint-disable-next-line no-prototype-builtins
          notitle={!this.$slots.hasOwnProperty('title')}
          insel={true}
        />
        <Popup
          vModel={this.popupVisible}
          safe-area-inset-bottom
          round
          ref="popup"
          class={bem('popup')}
          position={'bottom'}
          closeOnClickOverlay={this.closeOnClickOverlay}
          get-container="body" // 放body下不易出现异常情况
          // onClickOverlay={this.togglePopup}
          vusion-scope-id={this?.$vnode?.context?.$options?._scopeId}
          {...{
            attrs: { ...this.$attrs, 'vusion-empty-background': undefined },
          }}
        >
          <div class={bem(this.isNew && 'content-wrapper')}>
            {this.inDesigner() && (
              <div
                class={bem('designer-close-button')}
                vusion-click-enabled="true"
                onClick={this.designerClose}
              >
                点击关闭
              </div>
            )}
            {/* toolbar */}
            {this.genToolBar()}
            {/* search */}
            {this.filterable ? (
              <Search
                shape="round"
                vModel={this.filterText}
                placeholder={t('searchPlaceholder')}
              />
            ) : null}
            {!this.multiple && this.type === 'picker' && (
              <Picker
                ref="picker"
                {...{
                  attrs: {
                    ...this.$attrs,
                    columnsprop: this.data,
                    valueField: this.valueField,
                    textField: this.textField || this.$attrs.valueKey,
                  },
                }}
                scopedSlots={{
                  option: this.$scopedSlots.option,
                }}
                value={this.currentValue}
                style={this.style}
                {...{ on }}
              ></Picker>
            )}
            {(this.multiple || this.type === 'list') && (
              <List
                ref="picker"
                data={this.data}
                valueField={this.valueField}
                textField={this.textField}
                value={this.currentValue}
                multiple={this.multiple}
                enableSelectAll={this.enableSelectAll}
                scopedSlots={{
                  option: this.$scopedSlots.option,
                }}
                enableSelectedCount={this.enableSelectedCount}
                loading={this.currentLoading}
                {...{ on }}
              ></List>
            )}
            {this.renderBottom()}
          </div>
        </Popup>
      </div>
    );
  },
});
