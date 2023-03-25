import { RadioProps } from "./interface";
import * as React from "react";
import classnames from "classnames";
import InternalRadio, { RadioRef } from "./internal-radio";

const BaseRadio: React.ForwardRefRenderFunction<
  HTMLInputElement,
  RadioProps
> = (
  {
    prefixCls,
    className,
    style,
    checked,
    disabled,
    children,
    onChange,
    onMouseEnter,
    onMouseLeave,
    optionType,
    ...restProps
  },
  ref
) => {
  const labelCls = classnames(prefixCls, {});

  return (
    <label
      className={labelCls}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <InternalRadio
        {...restProps}
        checked={checked}
        disabled={disabled}
        ref={ref as React.Ref<RadioRef>}
      />
      {children ? <span>{children}</span> : undefined}
    </label>
  );
};
