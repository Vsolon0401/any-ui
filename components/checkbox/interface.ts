import * as React from "react";

export type CheckboxValueType = string | number | boolean;

export interface AbstractCheckboxProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  type?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  key?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: CheckboxChangeEvent) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  tabIndex?: number;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  value?: any;
}

export interface CheckboxProps extends AbstractCheckboxProps {
  indeterminate?: boolean;
}

export interface CheckboxRef {
  focus: () => void;
  blur: () => void;
  input: HTMLInputElement | null;
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: React.ChangeEvent<HTMLInputElement>["nativeEvent"];
}

export interface CheckboxOption {
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface AbstractCheckboxGroupProps {
  prefixCls?: string;
  className?: string;
  options?: (CheckboxOption | string | number)[];
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface CheckboxGroupProps extends AbstractCheckboxGroupProps {
  name?: string;
  defaultValue?: CheckboxValueType[];
  value?: any;
  onChange?: (checkedValue: CheckboxValueType[]) => void;
  children?: React.ReactNode;
}
