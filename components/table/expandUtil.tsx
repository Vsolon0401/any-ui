import { GetRowKey, Key, RenderExpandIconProps } from "./interface";
import React from "react";
import classnames from "classnames";

export const renderExpandIcon = <RecordType,>({
  prefixCls,
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) => {
  const expandClassName = `${prefixCls}-row-expand-icon`;
  if (!expandable) {
    return <span className={expandClassName} />;
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    onExpand(record, event);
    event.stopPropagation();
  };

  const expandRowCls = classnames(expandClassName, {
    [`${prefixCls}-row-expand`]: expanded,
    [`${prefixCls}-row-collapsed`]: !expanded,
  });
  return <span className={expandRowCls} onClick={handleClick} />;
};

export const findAllChildrenKeys = <RecordType,>(
  data: readonly RecordType[],
  getRowKey: GetRowKey<RecordType>,
  childrenColumnName: string
): Key[] => {
  const keys: Key[] = [];

  const dig = (list: readonly RecordType[]) => {
    list.forEach((item, index) => {
      keys.push(getRowKey(item, index));

      dig((item as any)[childrenColumnName]);
    });
  };

  dig(data);

  return keys;
};
