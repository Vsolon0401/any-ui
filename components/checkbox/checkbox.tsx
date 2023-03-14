import { CheckboxProps, CheckboxRef } from "./interface";
import { forwardRef, useContext, useEffect, useRef } from "react";
import warning from "../_util/warning";
import classnames from "classnames";
import * as React from "react";
import InternalCheckbox from "./internal-checkbox";
import { GroupContext } from "./group";
import * as process from "process";

const BaseCheckbox: React.ForwardRefRenderFunction<
  HTMLInputElement,
  CheckboxProps
> = (
  {
    prefixCls = "ai-checkbox",
    className,
    children,
    indeterminate = false,
    style,
    onMouseEnter,
    onMouseLeave,
    disabled,
    ...restProps
  },
  ref
) => {
  const checkboxGroup = useContext(GroupContext);
  const mergedDisabled = (checkboxGroup?.disabled || disabled) ?? disabled;
  const prevValue = useRef(restProps.value);

  useEffect(() => {
    checkboxGroup?.registerValue(restProps.value); // checkbox组初始赋值
    warning(
      "checked" in restProps || !!checkboxGroup || !("value" in restProps),
      "Checkbox",
      "`value` is not a valid prop, do you mean `checked`?"
    );
  }, []);

  useEffect(() => {
    if (restProps.value !== prevValue.current) {
      checkboxGroup?.cancelValue(prevValue.current);
      checkboxGroup?.registerValue(restProps.value);
      prevValue.current = restProps.value;
    }
    return () => checkboxGroup?.cancelValue(restProps.value);
  }, [restProps.value]);

  const checkboxProps: CheckboxProps = { ...restProps };
  if (checkboxGroup) {
    checkboxProps.onChange = (...args) => {
      if (restProps.onChange) {
        restProps.onChange(...args);
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({ label: children, value: restProps.value });
      }
    };
    checkboxProps.name = checkboxGroup.name;
    checkboxProps.checked = checkboxGroup.value.includes(restProps.value);
  }

  const labelCls = classnames(
    {
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
      [`${prefixCls}-wrapper-disabled`]: mergedDisabled,
    },
    className
  );

  const ariaCheckboxCls = classnames({
    [`${prefixCls}-indeterminate`]: indeterminate,
  });

  const ariaChecked = indeterminate ? "mixed" : undefined;

  return (
    <label
      className={labelCls}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <InternalCheckbox
        {...checkboxProps}
        aria-checked={ariaChecked}
        className={ariaCheckboxCls}
        disabled={mergedDisabled}
        ref={ref as React.Ref<CheckboxRef>}
      />
      {children !== undefined && (
        <span className={`${prefixCls}-description`}>{children}</span>
      )}
    </label>
  );
};

const Checkbox = forwardRef<unknown, CheckboxProps>(BaseCheckbox);

if (process.env.NODE_ENV !== "production") {
  Checkbox.displayName = "Checkbox";
}

export default Checkbox;
