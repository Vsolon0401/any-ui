import { useContext } from "react";
import TableContext from "../context/TableContext";

export type OnHover = (start: number, end: number) => void;

const inHoverRange = (
  cellStartRow: number,
  cellRowSpan: number,
  startRow: number,
  endRow: number
) => {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
};

export const useHoverState = (
  rowIndex: number,
  rowSpan: number
): [hovering: boolean, onHover: OnHover] => {
  const { hoverStartRow, hoverEndRow, onHover } = useContext(TableContext);
  const hovering = inHoverRange(
    rowSpan,
    rowIndex || 1,
    hoverStartRow,
    hoverEndRow
  );
  return [hovering, onHover];
};
