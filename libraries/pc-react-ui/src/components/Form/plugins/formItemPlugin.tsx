import React from 'react';
import _ from 'lodash';
import VusionValidator, { localizeRules } from '@lcap/validator';
import classnames from 'classnames';
import { FORMITEMPROPSFIELDS } from '@/components/Form/constants';

import { COLPROPSFIELDS } from '@/components/Row/constants';
import FormContext from '../form-context';
import { $deletePropsList } from '@/plugins/constants';

export function useHandleRule(props) {
  const { isForm } = React.useContext(FormContext);
  if (!isForm) return {};
  const rules = props.get('rules');
  return {
    rules: _.map(rules, (item) => {
      return {
        message: item.message,
        required: item.required,
        validateTrigger: ['onChange', 'onBlur'],
        ...item,
        validator: (rule, value) => {
          const validator = new VusionValidator(undefined, localizeRules, [rule]);
          return validator.validate(value);
        },
      };
    }),

  };
}
export function useHandleDefaultValue(props) {
  const { isForm, form } = React.useContext(FormContext);
  React.useEffect(() => {
    if (!isForm) return;
    const symbolName = Symbol('name');
    const name = props.get('name', symbolName);
    const defaultValue = props.get('defaultValue');
    form?.current?.setFieldValue?.(name, defaultValue ?? null);
  }, []);
}
useHandleDefaultValue.order = 5;
export function useHandleFormWarplabel(props) {
  const { width: widthContext, isForm, colSpan } = React.useContext(FormContext);
  if (!isForm) return {};
  const deletePropsList = props.get($deletePropsList).concat('labelIsSlot', 'labelText');
  const labelIsSlot = props.get('labelIsSlot');
  const labelProps = props.get('label');
  const labelText = props.get('labelText');
  const labelWidth = props.get('labelWidth');
  const widthProps = props.get('width');
  const spanProps = props.get('span');
  const labelCol = _.isNil(labelWidth) ? {} : { labelCol: { flex: `${labelWidth}px` } };
  const label = labelIsSlot ? labelProps : labelText;
  const span = _.defaults({ span: spanProps }, { span: colSpan });
  const width = _.defaults({ width: widthProps }, { width: widthContext });
  const formResult = isForm ? {
    label, ...labelCol, ...span, ...width,
  } : {};
  return {
    [$deletePropsList]: deletePropsList,
    ...formResult,
  };
}
export function useHandleFormItemProps(props) {
  const FormItemComponent = props.get('FormItemComponent');
  const { isForm } = React.useContext(FormContext);
  const deletePropsList = props.get($deletePropsList, []).concat(['FormItemComponent']);
  const renderInForm = React.useCallback(React.forwardRef((selfProps: any, ref) => {
    const formItemProps = _.pick(selfProps, FORMITEMPROPSFIELDS);
    const colProps = _.pick(selfProps, COLPROPSFIELDS);
    const fieldProps = {
      ..._.omit(selfProps, [...FORMITEMPROPSFIELDS, ...COLPROPSFIELDS, 'BasicsComponent']),
      className: classnames('cw-nasl', selfProps.className),
      popupClassName: 'cw-nasl',
      ref,
    };
    return (
      <FormItemComponent {...{
        ...formItemProps,
        fieldProps,
        colProps,
      }}
      />
    );
  }), [FormItemComponent]);

  return {
    [$deletePropsList]: deletePropsList,
    ...(isForm ? { render: renderInForm } : {}),
  };
}
