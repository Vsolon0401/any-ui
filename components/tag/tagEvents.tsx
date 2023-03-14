import * as React from "react";
import classnames from "classnames";

export interface TagEventsProps {
  prefixCls?: string;
  classNames?: string;
  isCheck: boolean;
  onChange?: (isCheck: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const TagEvents: React.FC<TagEventsProps> = ({
  prefixCls,
  classNames,
  isCheck,
  onChange,
  onClick,
  ...restProps
}) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onChange?.(!isCheck);
    onClick?.(e);
  };

  const cls = classnames(
    prefixCls,
    {
      [`${prefixCls}-check`]: true,
      [`${prefixCls}-check-able`]: isCheck,
    },
    classNames
  );

  return <span {...restProps} className={cls} onClick={handleClick} />;
};

export default TagEvents;
