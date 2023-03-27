import type {
  DefaultRecordType,
  GetComponent,
  GetRowKey,
  InternalTableProps,
} from "./interface";
import React from "react";
import getValue from "rc-util/lib/utils/get";
import * as process from "process";
import warning from "../_util/warning";
import useHover from "./hooks/useHover";
import useColumns from "./hooks/useColumns";

function InternalTable<RecordType extends DefaultRecordType>({
  prefixCls = "ai-table",
  className,
  rowClassName,
  style,
  data,
  rowKey = "key",
  scroll,
  tableLayout,
  direction,
  // Additional Part

  footer,
  summary,
  caption,
  // Customize
  id,
  showHeader,
  components,
  emptyText,
  onRow,
  onHeaderRow,
  // Internal
  internalHooks,
  transformColumns,
  internalRefs,
  sticky,
}: InternalTableProps<RecordType>) {
  // ==================== Customize =====================
  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) => getValue(components, path) || defaultComponent,
    [components]
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === "function") {
      return rowKey;
    }

    return (record: RecordType) => {
      const key = record && record[rowKey];

      if (process.env.NODE_ENV !== "production") {
        warning(
          key !== undefined,
          "table",
          "table should have a unique `key` prop"
        );
      }

      return key;
    };
  }, [rowKey]);

  // ==================== Hover =====================
  const [startRow, endRow, onHover] = useHover();

  // ====================== Column ======================
  const [componentWidth, setComponentWidth] = React.useState(0);

  // const [columns, flattenColumns] = useColumns(
  //   {
  //     prefixCls,
  //     columns,
  //     children,
  //     expandable,
  //     expandedKeys,
  //     columnTitle,
  //     getRowKey,
  //     onTriggerExpand,
  //     expandIcon,
  //     rowExpandable,
  //     expandIconColumnIndex,
  //     direction,
  //     expandRowByClick,
  //     columnWidth,
  //     fixed,
  //   },
  //   transformColumns
  // )

  const renderFixedHeaderTable = React.useCallback();
}
