import {
  CellType,
  ColumnType,
  DataIndex,
  DefaultRecordType,
  RenderedCell,
} from "../interface";
import * as React from "react";
import useMemo from "rc-util/lib/hooks/useMemo";
import getValue from "rc-util/lib/utils/get";
import { warning } from "rc-util/lib/warning";
import isEqual from "rc-util/lib/isEqual";

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>
): data is RenderedCell<RecordType> {
  return (
    typeof data === "object" &&
    !Array.isArray(data) &&
    !React.isValidElement(data)
  );
}

export const useCellRender = <RecordType extends DefaultRecordType>(
  record: RecordType,
  dataIndex: DataIndex,
  renderIndex: number,
  children?: React.ReactNode,
  render?: ColumnType<RecordType>["render"],
  shouldCellUpdate?: ColumnType<RecordType>["shouldCellUpdate"]
) => {
  const retData = useMemo<
    [React.ReactNode, CellType<RecordType>] | [React.ReactNode]
  >(
    // @ts-ignore
    () => {
      if (children) {
        return [children];
      }

      const path =
        dataIndex === null || dataIndex === undefined || dataIndex === ""
          ? []
          : Array.isArray(dataIndex)
          ? dataIndex
          : [dataIndex];

      const value: Record<string, unknown> | React.ReactNode = getValue(
        record,
        path
      );

      let returnChildNode = value;
      let returnCellProps: CellType<RecordType> | undefined = undefined;

      if (render) {
        const renderData = render(value, record, renderIndex);

        if (isRenderCell(renderData)) {
          if (process.env.NODE_ENV !== "production") {
            warning(false, "");
          }

          returnChildNode = renderData.children;
          returnCellProps = renderData.props;
        } else {
          returnChildNode = renderData;
        }
      }
      return [returnChildNode, returnCellProps];
    },
    [record, children, dataIndex, render, renderIndex],
    (prev, next) => {
      if (shouldCellUpdate) {
        const [, prevRecord] = prev;
        const [, nextRecord] = next;
        return shouldCellUpdate(
          nextRecord as RecordType,
          prevRecord as RecordType
        );
      }

      return !isEqual(prev, next, true);
    }
  );

  return retData;
};
