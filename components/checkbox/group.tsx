import * as React from "react";
import {
  CheckboxGroupProps,
  CheckboxOption,
  CheckboxValueType,
} from "./interface";
import { createContext, forwardRef, useEffect, useState } from "react";
import Checkbox from "./checkbox";
import classnames from "classnames";
import "./style/index.scss";

export interface CheckboxGroupContext {
  name?: string;
  toggleOption?: (option: CheckboxOption) => void;
  value?: any;
  disabled?: boolean;
  registerValue: (val: string) => void;
  cancelValue: (val: string) => void;
}

export const GroupContext = createContext<CheckboxGroupContext | null>(null);

const InternalCheckboxGroup: React.ForwardRefRenderFunction<
  HTMLDivElement,
  CheckboxGroupProps
> = (
  {
    defaultValue,
    children,
    options = [],
    className,
    style,
    onChange,
    ...restProps
  },
  ref
) => {
  const [value, setValue] = useState<CheckboxValueType[]>(
    restProps.value || defaultValue || []
  );
  const [registeredValue, setRegisteredValue] = useState<CheckboxValueType[]>(
    []
  );

  useEffect(() => {
    if ("value" in restProps) {
      setValue(restProps.value || []);
    }
  }, [restProps.value]);

  const getOptions = () =>
    options.map((option) => {
      if (typeof option === "string" || typeof option === "number") {
        return {
          label: option,
          value: option,
        };
      }
      return option;
    });

  const cancelValue = (val: string) => {
    setRegisteredValue((prevValue) => prevValue.filter((el) => el !== val));
  };

  const registerValue = (val: string) => {
    setRegisteredValue((prevValues) => [...prevValues, val]);
  };

  const toggleOption = (opt: CheckboxOption) => {
    const optionIndex = value.indexOf(opt.value);
    const newValue = [...value];

    if (optionIndex === -1) {
      newValue.push(opt.value);
    } else {
      newValue.splice(optionIndex, 1);
    }

    if (!("value" in restProps)) {
      setValue(newValue);
    }

    const options = getOptions();
    onChange?.(
      newValue
        .filter((val) => registeredValue.includes(val))
        .sort((a, b) => {
          const _a = options.findIndex((opt) => opt.value === a);
          const _b = options.findIndex((opt) => opt.value === b);
          return _a - _b;
        })
    );
  };

  if (options && options.length) {
    // eslint-disable-next-line no-param-reassign
    children = getOptions().map((option) => (
      <Checkbox
        key={option.value.toString()}
        disabled={"disabled" in option ? option.disabled : restProps.disabled}
        value={option.value}
        checked={!value.includes(option.value)}
        onChange={option.onChange}
        className={`ai-checkbox-group-item`}
        style={option.style}
      >
        {option.label}
      </Checkbox>
    ));
  }

  const contextValue = {
    toggleOption,
    value,
    disabled: restProps.disabled,
    name: restProps.name,
    registerValue,
    cancelValue,
  };

  const checkboxGroupCls = classnames("ai-checkbox-group", className);

  return (
    <div className={checkboxGroupCls} style={style} ref={ref}>
      <GroupContext.Provider value={contextValue}>
        {children}
      </GroupContext.Provider>
    </div>
  );
};

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  InternalCheckboxGroup
);

export default React.memo(CheckboxGroup);
