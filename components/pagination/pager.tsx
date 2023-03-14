import * as React from "react";
import { PaginationItemType } from "./interface";
import classnames from "classnames";

interface PagerProps {
  prefixCls?: string;
  className?: string;
  page: number;
  active?: boolean;
  showTitle?: boolean;
  itemRender: (
    page: number,
    type: PaginationItemType,
    element: React.ReactNode
  ) => React.ReactNode;
  onClick: (page: number) => void;
  onKeyPress: (
    event: React.KeyboardEvent<HTMLLIElement>,
    callback: (arg: any) => void,
    ...restParams: any[]
  ) => void;
}

const Pager: React.FC<PagerProps> = ({
  prefixCls,
  className,
  page,
  active,
  showTitle,
  itemRender,
  onClick,
  onKeyPress,
}) => {
  const fixCls = `${prefixCls}-item`;
  const pagerCls = classnames(
    fixCls,
    `${fixCls}-${page}`,
    {
      [`${fixCls}-active`]: active,
      [`${fixCls}-disabled`]: !page,
    },
    className
  );

  const handleClick = () => {
    onClick(page);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLLIElement>) => {
    onKeyPress(e, onClick, page);
  };

  return (
    <li
      title={showTitle ? page.toString() : undefined}
      className={pagerCls}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      {itemRender(page, "page", <a rel="nofollow">{page}</a>)}
    </li>
  );
};

export default Pager;
