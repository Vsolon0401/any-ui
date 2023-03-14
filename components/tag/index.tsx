import * as React from "react";
import classnames from "classnames";
import TagEvents from "./tagEvents";
import "./style/index.scss";

export const PresetStatusColorTypes = [
  "success",
  "processing",
  "error",
  "default",
  "warning",
];

export const PresetColorTypes = ["blue", "purple", "red"];

export type PresetStatusColorType = (typeof PresetStatusColorTypes)[number];

export type PresetColorType = (typeof PresetColorTypes)[number];

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefixCls?: string;
  className?: string;
  closeable?: boolean;
  closeIcon?: React.ReactNode;
  color: PresetColorType | PresetStatusColorType | string;
  icon?: React.ReactNode;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface TagType
  extends React.ForwardRefExoticComponent<
    TagProps & React.RefAttributes<HTMLElement>
  > {
  TagEvent: typeof TagEvents;
}

const BaseTag: React.ForwardRefRenderFunction<HTMLSpanElement, TagProps> = (
  {
    prefixCls = "ai",
    className,
    children,
    icon,
    color = "default",
    onClose,
    closeable = false,
    closeIcon,
    ...restProps
  },
  ref
) => {
  const hasInternalColor =
    PresetColorTypes.includes(color) || PresetStatusColorTypes.includes(color);

  const tagCls = classnames(
    `${prefixCls}-tag`,
    {
      [`${prefixCls}-${color}`]: hasInternalColor,
      [`${prefixCls}-has-color`]: color && !hasInternalColor,
    },
    className
  );

  const tagStyle = {
    background: color && !hasInternalColor ? color : undefined,
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClose?.(e);

    if (e.defaultPrevented) {
      return;
    }
  };

  const renderCloseIcon = () => {
    if (closeable) {
      return closeIcon ? (
        <span className={`${prefixCls}-close-icon`} onClick={handleCloseClick}>
          {closeIcon}
        </span>
      ) : (
        <span className={`${prefixCls}-close-icon`} onClick={handleCloseClick}>
          Ⅹ
        </span>
      );
    }
  };

  const kids = icon ? (
    <>
      {icon}
      <span>{children}</span>
    </>
  ) : (
    children
  );

  return (
    <span {...restProps} ref={ref} className={tagCls} style={tagStyle}>
      {kids}
      {renderCloseIcon()}
    </span>
  );
};

const Tag = React.forwardRef<unknown, TagProps>(BaseTag) as TagType;

if (process.env.NODE_ENV !== "production") {
  Tag.displayName = "Tag";
}

Tag.TagEvent = TagEvents;

export default Tag;
