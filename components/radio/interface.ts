import * as React from "react";
import {
  AbstractCheckboxGroupProps,
  AbstractCheckboxProps,
} from "../checkbox/interface";

export type RadioOptionType = "default" | "button";

export interface RadioProps extends AbstractCheckboxProps {
  optionType?: RadioOptionType;
}

export interface RadioGroupProps extends AbstractCheckboxGroupProps {
  defaultValue?: any;
  value?: any;
  onChange?: (e: RadioChangeEvent) => void;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onFocus?: (e: React.MouseEventHandler<HTMLInputElement>) => void;
  onBlur?: (e: React.MouseEventHandler<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  children?: React.ReactNode;
  optionType?: RadioOptionType;
}

export interface RadioGroupContextProps {
  onChange: (e: RadioChangeEvent) => void;
  value?: any;
  disabled?: boolean;
  name?: string;
  optionType?: RadioOptionType;
}

export interface RadioChangeEvent {
  target: RadioChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: React.ChangeEvent<HTMLInputElement>["nativeEvent"];
}

export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean;
}
