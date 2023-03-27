import { responseImmutable, useContext } from "@rc-component/context";
import * as React from "react";
import TableContext from "../context/TableContext";
import type {
  CellType,
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  GetComponentProps,
  StickyOffsets,
} from "../interface";
import HeaderRow from "./HeaderRow";

/**
 * parseHeaderRows返回列中（包括子列）的单元格扩展信息
 * @param rootColumns
 */
function parseHeaderRows<RecordType>(
  rootColumns: ColumnsType<RecordType>
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  function fillRowCells(
    columns: ColumnsType<RecordType>,
    colIndex: number,
    rowIndex: number = 0
  ): number[] {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans: number[] = columns.filter(Boolean).map((column) => {
      // init cell
      const cell: CellType<RecordType> = {
        key: column.key,
        className: column.className || "",
        children: column.title,
        column,
        colStart: currentColIndex,
      };

      let colSpan: number = 1;

      // 检查是否有子列
      const subColumns = (column as ColumnGroupType<RecordType>).children;
      if (subColumns && subColumns.length > 0) {
        // 递归的将子列的扩展列累加到colSpan
        colSpan = fillRowCells(
          subColumns,
          currentColIndex,
          rowIndex + 1
        ).reduce((total, count) => total + count, 0);
        cell.hasSubColumns = true;
      }

      // 检查是否有已定义的列扩展
      if ("colSpan" in column) {
        ({ colSpan } = column);
      }
      // 检查是否有已定义的行扩展
      if ("rowSpan" in column) {
        cell.rowSpan = column.rowSpan;
      }

      // 赋值单元格扩展
      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart + colSpan - 1;
      rows[rowIndex].push(cell);

      currentColIndex += colSpan;

      return colSpan;
    });

    return colSpans;
  }

  // Generate `rows` cell data
  fillRowCells(rootColumns, 0);

  // Handle `rowSpan`
  const rowCount = rows.length;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows[rowIndex].forEach((cell) => {
      if (!("rowSpan" in cell) && !cell.hasSubColumns) {
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  }

  return rows;
}

export interface HeaderProps<RecordType> {
  /** 属性列*/
  columns: ColumnsType<RecordType>;
  /** 扁平化*/
  flattenColumns: readonly ColumnType<RecordType>[];
  stickyOffsets: StickyOffsets;
  /** 获取column属性*/
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
}

function Header<RecordType>(
  props: HeaderProps<RecordType>
): React.ReactElement {
  const { stickyOffsets, columns, flattenColumns, onHeaderRow } = props;
  // 从上下文中取出header的前缀类与自定义渲染组件
  const { prefixCls, getComponent } = useContext(TableContext, [
    "prefixCls",
    "getComponent",
  ]);

  const rows: CellType<RecordType>[][] = React.useMemo(
    () => parseHeaderRows(columns),
    [columns]
  );

  // 定义渲染header的HTML标签
  const WrapperComponent = getComponent(["header", "wrapper"], "thead");
  const trComponent = getComponent(["header", "row"], "tr");
  const thComponent = getComponent(["header", "cell"], "th");
  const tdComponent = getComponent(["header", "cell"], "td");

  // render -> <thead>map(<HeaderRow/>)</thead>
  return (
    <WrapperComponent className={`${prefixCls}-thead`}>
      {rows.map((row, rowIndex) => {
        const rowNode = (
          <HeaderRow
            key={rowIndex}
            flattenColumns={flattenColumns}
            cells={row}
            stickyOffsets={stickyOffsets}
            rowComponent={trComponent}
            cellComponent={thComponent}
            tdCellComponent={tdComponent}
            onHeaderRow={onHeaderRow}
            index={rowIndex}
          />
        );

        return rowNode;
      })}
    </WrapperComponent>
  );
}

export default responseImmutable(Header);
