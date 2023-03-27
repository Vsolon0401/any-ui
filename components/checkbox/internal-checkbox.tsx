import * as React from "react";
import { CheckboxChangeEvent, CheckboxRef } from "./interface";
import { forwardRef, useImperativeHandle, useRef } from "react";
import useMergedState from "rc-util/lib/hooks/useMergedState";
import classnames from "classnames";
// @ts-ignore
import PropTypes, { any } from "prop-types";
import "./style/index.scss";

interface InternalCheckboxProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  prefixCls?: string;
  onChange?: (e: CheckboxChangeEvent) => void;
}

const InternalCheckbox = forwardRef<CheckboxRef, InternalCheckboxProps>(
  (props, ref) => {
    const {
      prefixCls = "ai-checkbox",
      className,
      checked,
      disabled,
      defaultChecked = false,
      type = "checkbox",

      onChange,
      ...inputProps
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [rawValue, setRawValue] = useMergedState(defaultChecked, {
      value: checked,
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      input: inputRef.current,
    }));

    /*check*/

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (!("checked" in props)) {
        setRawValue(e.target.checked);
      }

      onChange?.({
        target: {
          ...props,
          checked: e.target.checked,
        },
        stopPropagation() {
          e.stopPropagation();
        },
        preventDefault() {
          e.preventDefault();
        },
        nativeEvent: e.nativeEvent,
      });
    };

    /*issue: 每次change后inputProps为空*/
    // console.log(prevValue)

    const checkboxCls = classnames(prefixCls, className, {
      [`${prefixCls}-checked`]: rawValue,
      [`${prefixCls}-disabled`]: disabled,
    });

    return (
      <span className={checkboxCls}>
        <input
          {...inputProps}
          className={`${prefixCls}-input`}
          ref={inputRef}
          onChange={handleChange}
          disabled={disabled}
          checked={!!rawValue}
          type={type}
        />
        <span className={`${prefixCls}-inner`} />
      </span>
    );
  }
);

InternalCheckbox.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string || undefined,
  checked: any,
  disabled: any,
  defaultChecked: any,
  type: PropTypes.string,
  onChange: any,
};

if (process.env.NODE_ENV !== "production") {
  InternalCheckbox.displayName = "InternalCheckbox";
}

export default React.memo(InternalCheckbox);
