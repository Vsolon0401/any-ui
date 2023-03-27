import React from "react";
import type {
  ColumnGroupType,
  ColumnType,
  DataIndex,
  Direction,
  FixedInfo,
  FixedType,
  Key,
  RenderExpandIconProps,
  StickyOffsets,
  GetColumnKeyColumn,
} from "./interface";

export const getKeyValue =
  <T extends {}, U extends keyof T>(key: U) =>
  (obj: T) =>
    obj[key];

export const ascSort = <T extends object>(target: string, list: T[]): T[] => {
  return list.sort((a, b): number => {
    // @ts-ignore
    const _a = getKeyValue<keyof T, T>(target)(a);
    // @ts-ignore
    const _b = getKeyValue<keyof T, T>(target)(b);
    if (_a < _b) return -1;
    if (_a > _b) return 1;
    return 0;
  });
};

export const descSort = <T extends object>(target: string, list: T[]): T[] => {
  return list.sort((a, b): number => {
    // @ts-ignore
    const _a = getKeyValue<keyof T, T>(target)(a);
    // @ts-ignore
    const _b = getKeyValue<keyof T, T>(target)(b);
    if (_a > _b) return -1;
    if (_a < _b) return 1;
    return 0;
  });
};

type TableElementType = string | number;

export const tableFilter = <T extends {}>(
  target: TableElementType,
  key: string,
  list: T[]
): T[] => {
  return list.filter((cur) => {
    // @ts-ignore
    const _cur = getKeyValue<keyof T, T>(key)(cur);
    if (_cur === target) {
      return cur;
    }
    return null;
  });
};

/**
 * getColumnsKey返回传入对应column组的key组
 * @param columns 属性组
 */
export const getColumnsKey = (columns: readonly GetColumnKeyColumn[]) => {
  const columnKeys: React.Key[] = [];
  const keys: Record<React.Key, boolean> = {};

  columns.forEach((column) => {
    const { key, dataIndex } = column || {};

    let mergedKey =
      key ||
      (Array.isArray(dataIndex)
        ? dataIndex.join("-")
        : [dataIndex].join("-")) ||
      "TABLE_KEY";

    while (keys[mergedKey]) {
      mergedKey = `${mergedKey}_next`;
    }
    keys[mergedKey] = true;
    columnKeys.push(mergedKey);
  });

  return columnKeys;
};

/**
 * getCellFixedInfo返回有关fixed的信息，通过传入的数据值计算出fixed的位置信息
 * @param colStart 列起点位置
 * @param colEnd 列终点位置
 * @param columns 属性组中已有的fixed位置信息
 * @param stickyOffsets
 * @param direction 方位
 * @param curColumn 当前属性列
 */
export const getCellFixedInfo = <RecordType = any>(
  colStart: number,
  colEnd: number,
  columns: readonly { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
  direction: Direction,
  curColumns?: ColumnType<RecordType> | ColumnGroupType<RecordType>
): FixedInfo => {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};
  let fixLeft: number = NaN;
  let fixRight: number = NaN;

  let lastFixLeft: boolean = false;
  let firstFixRight: boolean = false;
  let lastFixRight: boolean = false;
  let firstFixLeft: boolean = false;

  if (startColumn.fixed === "left") {
    fixLeft = stickyOffsets.left[colStart];
  } else if (endColumn.fixed === "right") {
    fixRight = stickyOffsets.right[colEnd];
  }

  const nextColumn = columns[colEnd + 1];
  const prevColumn = columns[colStart - 1];
  const canLastFix = !(curColumns as ColumnGroupType<RecordType>)?.children;
  if (direction === "rtl") {
    if (!isNaN(fixLeft)) {
      const prevFixLeft = prevColumn && prevColumn.fixed === "left";
      firstFixLeft = !prevFixLeft && canLastFix;
    } else if (!isNaN(fixRight)) {
      const nextFixRight = nextColumn && nextColumn.fixed === "right";
      lastFixRight = !nextFixRight && canLastFix;
    }
  } else if (!isNaN(fixLeft)) {
    const nextFixLeft = nextColumn && nextColumn.fixed === "left";
    lastFixLeft = !nextFixLeft && canLastFix;
  } else if (!isNaN(fixRight)) {
    const prevFixRight = prevColumn && prevColumn.fixed === "right";
    firstFixRight = !prevFixRight && canLastFix;
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    lastFixRight,
    firstFixLeft,
    isSticky: stickyOffsets.isSticky,
  };
};

// Expand
