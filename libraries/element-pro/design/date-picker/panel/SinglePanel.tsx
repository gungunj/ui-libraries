import { defineComponent, PropType, computed } from '@vue/composition-api';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import ElPanelContent from './PanelContent';
import ElExtraContent from './ExtraContent';
import { ElDatePickerProps } from '../type';
import { getDefaultFormat, parseToDayjs } from '../../_common/js/date-picker/format';
import useTableData from '../hooks/useTableData';
import useDisableDate, { disableDateProps } from '../hooks/useDisableDate';
import { ElTimePickerProps } from '../../time-picker';

export default defineComponent({
  name: 'ElSinglePanel',
  props: {
    disableDate: [Object, Array, Function] as PropType<ElDatePickerProps['disableDate']>,
    disableTime: Function as PropType<ElDatePickerProps['disableTime']>,
    mode: {
      type: String as PropType<ElDatePickerProps['mode']>,
      default: 'date',
    },
    format: String as PropType<ElDatePickerProps['format']>,
    presetsPlacement: {
      type: String as PropType<ElDatePickerProps['presetsPlacement']>,
      default: 'bottom',
    },
    value: [String, Number, Array, Date] as PropType<ElDatePickerProps['value']>,
    timePickerProps: Object as PropType<ElDatePickerProps['timePickerProps']>,
    presets: Object as PropType<ElDatePickerProps['presets']>,
    enableTimePicker: Boolean,
    firstDayOfWeek: Number,
    year: Number,
    month: Number,
    time: String,
    popupVisible: Boolean,
    onPanelClick: Function,
    onCellClick: Function,
    onCellMouseEnter: Function,
    onCellMouseLeave: Function,
    onJumperClick: Function,
    onConfirmClick: Function,
    onPresetClick: Function,
    onYearChange: Function,
    onMonthChange: Function,
    onTimePickerChange: Function,
  },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('date-picker__panel');
    const { global } = useConfig('datePicker');

    const { format } = getDefaultFormat({
      mode: props.mode,
      format: props.format,
      enableTimePicker: props.enableTimePicker,
    });

    const disableDateOptions = computed(() => useDisableDate({
      format,
      mode: props.mode,
      disableDate: props.disableDate,
    }));

    const disableTime: ElTimePickerProps['disableTime'] = (h: number, m: number, s: number) => {
      if (typeof props.disableTime !== 'function' || !props.value) {
        return {};
      }

      const disableTimeObj = { hour: [h], minute: [m], second: [s] };
      const checkTime = parseToDayjs(props.value, format).hour(h).minute(m).second(s).toDate();
      if (props.disableTime(checkTime)) {
        return disableTimeObj;
      }

      return {};
    };

    const tableData = computed(() => useTableData({
      year: props.year,
      month: props.month,
      mode: props.mode,
      start: props.value ? parseToDayjs(props.value, format).toDate() : undefined,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      ...disableDateOptions.value,
    }));

    const panelContentProps = computed(() => ({
      format,
      value: props.value,
      mode: props.mode,
      year: props.year,
      month: props.month,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      tableData: tableData.value,
      popupVisible: props.popupVisible,
      enableTimePicker: props.enableTimePicker,
      timePickerProps: {
        ...(props.timePickerProps as any),
        disableTime,
      },
      time: props.time,
      onMonthChange: props.onMonthChange,
      onYearChange: props.onYearChange,
      onJumperClick: props.onJumperClick,
      onCellClick: props.onCellClick,
      onCellMouseEnter: props.onCellMouseEnter,
      onCellMouseLeave: props.onCellMouseLeave,
      onTimePickerChange: props.onTimePickerChange,
    }));

    const extraProps = computed(() => ({
      presets: props.presets,
      enableTimePicker: props.enableTimePicker,
      presetsPlacement: props.presetsPlacement,
      onPresetClick: props.onPresetClick,
      onConfirmClick: props.onConfirmClick,
      selectedValue: props.value,
    }));

    return { COMPONENT_NAME, panelContentProps, extraProps };
  },

  render() {
    const { COMPONENT_NAME, panelContentProps, extraProps } = this;
    return (
      <div
        class={[
          COMPONENT_NAME,
          {
            [`${COMPONENT_NAME}--direction-row`]: ['left', 'right'].includes(this.presetsPlacement),
          },
        ]}
        onClick={(e: MouseEvent) => this.onPanelClick?.({ e })}
      >
        {['top', 'left'].includes(this.presetsPlacement) ? <ElExtraContent {...{ props: extraProps }} /> : null}
        <ElPanelContent {...{ props: panelContentProps }} />
        {['bottom', 'right'].includes(this.presetsPlacement) ? <ElExtraContent {...{ props: extraProps }} /> : null}
      </div>
    );
  },
});
