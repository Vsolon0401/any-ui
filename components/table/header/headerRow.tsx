import {
  CellType,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
  StickyOffsets,
} from "../interface";
import React from "react";
import { useContext } from "@rc-component/context";
import TableContext from "../context/TableContext";
import { getCellFixedInfo, getColumnsKey } from "../utils";
import Cell from "../cell";

export interface RowProps<RecordType> {
  /** 单元格组*/
  cells: readonly CellType<RecordType>[];
  /** 粘性布局信息*/
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  /** 自定义组件*/
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  tdCellComponent: CustomizeComponent;
  /** 取出单元格属性*/
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
  /** 组件索引*/
  index: number;
}

const HeaderRow = <RecordType,>({
  cells,
  stickyOffsets,
  flattenColumns,
  rowComponent: RowComponent,
  cellComponent: CellComponent,
  tdCellComponent,
  onHeaderRow,
  index,
}: RowProps<RecordType>) => {
  // 从上下文取出前缀类，组价方位
  const { prefixCls, direction } = useContext(TableContext, [
    "prefixCls",
    "direction",
  ]);

  let rowProps: React.HTMLAttributes<HTMLElement>;
  if (onHeaderRow) {
    rowProps = onHeaderRow(
      cells.map((cell) => cell.column as ColumnType<RecordType>),
      index
    );
  }
  const columnsKey = getColumnsKey(cells.map((cell) => cell.column));

  return (
    <RowComponent>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column } = cell;
        const fixedInfo = getCellFixedInfo<RecordType>(
          cell.colStart,
          cell.colEnd,
          flattenColumns,
          stickyOffsets,
          direction,
          column
        );

        let additionalProps: React.HTMLAttributes<HTMLElement> =
          column?.onHeaderCell?.(column);

        return (
          <Cell
            {...cell}
            {...fixedInfo}
            scope={
              column?.title
                ? cell.colSpan > 1
                  ? "colgroup"
                  : "col"
                : undefined
            }
            ellipsis={column?.ellipsis}
            align={column?.align}
            component={column?.title ? CellComponent : tdCellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            additionalProps={additionalProps}
            rowType="header"
          />
        );
      })}
    </RowComponent>
  );
};

HeaderRow.displayName = "HeaderRow";

export default React.memo(HeaderRow);
