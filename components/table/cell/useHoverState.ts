import TableContext from "../context/TableContext";
import { useContext } from "@rc-component/context";

export type OnHover = (start: number, end: number) => void;

/**
 * inHoverRange返回hover作用域是否在单元格内
 * @param cellStartRow 单元格行起点
 * @param cellRowSpan 单元格行扩展
 * @param startRow hover作用行起点
 * @param endRow hover作用行终点
 */
const inHoverRange = (
  cellStartRow: number,
  cellRowSpan: number,
  startRow: number,
  endRow: number
) => {
  // 计算单元格行终点
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
};

/**
 * useHoverState返回一个数组，
 * 包括hovering，onHover。
 * hovering判断hover作用域是否在单元格内
 * onHover作为事件回调函数
 * @param rowIndex 单元格行引索
 * @param rowSpan 单元格行扩展
 */
export const useHoverState = (
  rowIndex: number,
  rowSpan: number
): [hovering: boolean, onHover: OnHover] => {
  return useContext(TableContext, (ctx) => {
    const hovering = inHoverRange(
      rowIndex,
      rowSpan || 1,
      ctx.hoverStartRow,
      ctx.hoverEndRow
    );
    return [hovering, ctx.onHover];
  });
};
