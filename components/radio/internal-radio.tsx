import * as React from "react";
import { useImperativeHandle } from "react";
// @ts-ignore
import PropTypes, { any } from "prop-types";
import useMergedState from "rc-util/lib/hooks/useMergedState";
import { RadioChangeEvent, RadioOptionType } from "./interface";
import classnames from "classnames";

interface InternalRadioProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, "onChange"> {
  prefixCls?: string;
  disabled?: boolean;
  checked?: boolean;
  value?: any;
  type?: React.HTMLInputTypeAttribute;
  optionType?: RadioOptionType;
  onChange?: (e: RadioChangeEvent) => void;
}

export interface RadioRef {
  focus: () => void;
  blur: () => void;
  input: HTMLInputElement | null;
}

const InternalRadio = React.forwardRef<RadioRef, InternalRadioProps>(
  (props, ref) => {
    const {
      defaultChecked = false,
      prefixCls = "ai-radio",
      className,
      children,
      disabled,
      checked,
      value,
      type = "radio",
      optionType,
      onChange,
      ...otherProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [radioState, setRadioState] = useMergedState(defaultChecked, {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if ("checked" in props) {
        setRadioState(e.target.checked);
      }
      onChange?.({
        target: {
          checked: e.target.checked,
        },
        stopPropagation: () => e.stopPropagation(),
        preventDefault: () => e.preventDefault(),
        nativeEvent: e.nativeEvent,
      });
    };

    const internalRadioCls = classnames(
      prefixCls,
      {
        [`${prefixCls}-checked`]: radioState,
        [`${prefixCls}-disabled`]: disabled,
      },
      className
    );

    return (
      <span className={internalRadioCls}>
        <input
          {...otherProps}
          type={type}
          checked={radioState}
          ref={inputRef}
          disabled={disabled}
          onChange={handleChange}
        />
        <span className={`${prefixCls}-inner`} />
      </span>
    );
  }
);

InternalRadio.propTypes = {
  defaultChecked: PropTypes.boolean,
  className: PropTypes.string,
  children: PropTypes.any,
};

if (process.env.NODE_ENV !== "production") {
  InternalRadio.displayName = "InternalRadio";
}

export default InternalRadio;
