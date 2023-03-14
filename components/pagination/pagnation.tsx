import * as React from "react";
import { PaginationProps } from "./interface";
import classnames from "classnames";
import "./style/index.scss";
import InternalPagination from "./internal-pagination";

export interface PaginationConfig extends PaginationProps {
  size?: "default" | "small";
  position?: "top" | "bottom";
}

const Pagination: React.FC<PaginationConfig> = ({
  prefixCls = "ai-pagination",
  size = "default",
  position = "bottom",
  ...restProps
}) => {
  const extendedClassName = classnames({
    [`ai-pagination-${size}`]: size,
    [`ai-pagination-${position}`]: position,
  });

  return (
    <InternalPagination
      {...restProps}
      prefixCls={prefixCls}
      className={extendedClassName}
    />
  );
};

if (process.env.NODE_ENV !== "production") {
  Pagination.displayName = "Pagination";
}

export default Pagination;
