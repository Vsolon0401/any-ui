import React from "react";

export type PaginationItemType =
  | "page"
  | "prev"
  | "next"
  | "jump-prev"
  | "jump-next";

export interface PaginationData {
  className: string;
  selectPrefixCls: string;
  prefixCls: string;
  pageSizeOptions: string[] | number[];

  current: number;
  defaultCurrent: number;
  total: number;
  pageSize: number;
  defaultPageSize: number;

  hideOnSinglePage: boolean;
  showSizeChanger: boolean;
  showLessItems: boolean;
  showPrevNextJumpers: boolean;
  showQuickJumper: boolean | object;
  showTitle: boolean;
  simple: boolean;
  disabled: boolean;

  locale: PaginationLocale;

  style: React.CSSProperties;

  selectComponentClass: React.ComponentType;
  prevIcon: React.ComponentType | React.ReactNode;
  nextIcon: React.ComponentType | React.ReactNode;
  jumpPrevIcon: React.ComponentType | React.ReactNode;
  jumpNextIcon: React.ComponentType | React.ReactNode;
}

export interface PaginationLocale {
  items_per_page?: string;
  jump_to?: string;
  jump_to_confirm?: string;
  page?: string;

  prev_page?: string;
  next_page?: string;
  prev_5?: string;
  next_5?: string;
  prev_3?: string;
  next_3?: string;
}

export interface PaginationProps extends Partial<PaginationData> {
  totalBoundaryShowSizeChanger?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  itemRender?: (
    page: number,
    type: PaginationItemType,
    element: React.ReactNode
  ) => React.ReactNode;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}
