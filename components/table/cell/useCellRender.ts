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

/**
 * isRenderCell用于校验传入的节点是否合法
 * @param data 单元格节点
 */
function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>
): data is RenderedCell<RecordType> {
  return (
    typeof data === "object" &&
    !Array.isArray(data) &&
    !React.isValidElement(data)
  );
}

/**
 * useCellRender返回一个ReactNode类型的节点，
 * @param record
 * @param dataIndex 数据引索
 * @param renderIndex 渲染引索对于记录的引索
 * @param children 子节点
 * @param render 渲染函数，返回值为ReactNode类的节点 或者 RenderedCell类的节点
 * @param shouldCellUpdate 更新依据
 */
export const useCellRender = <RecordType>(
  record: RecordType,
  dataIndex: DataIndex | undefined,
  renderIndex?: number,
  children?: React.ReactNode,
  render?: ColumnType<RecordType>["render"],
  shouldCellUpdate?: ColumnType<RecordType>["shouldCellUpdate"]
) => {
  // useMemo返回当前ref实例，值为getValue的返回值，并且放回实例条件(类似依赖)
  const retData = useMemo<
    | [
        Record<string, unknown> | React.ReactNode,
        CellType<RecordType> | undefined
      ]
    | [React.ReactNode]
  >(
    () => {
      // 若存在子节点，就返回
      if (children !== null && children !== undefined) {
        return [children];
      }

      // 格式化数据引索
      const path =
        dataIndex === null || dataIndex === undefined || dataIndex === ""
          ? []
          : Array.isArray(dataIndex)
          ? dataIndex
          : [dataIndex];

      // getValue返回record中对应path的元素，path为空时返回undefined
      const value: Record<string, unknown> | React.ReactNode = getValue(
        record,
        path
      );

      let returnChildNode = value;
      let returnCellProps: CellType<RecordType> | undefined = undefined;

      // 若存在渲染函数，则返回渲染后的返回值
      if (render && renderIndex) {
        const renderData = render(value, record, renderIndex);
        // 分类讨论renderData的值：ReactNode | RenderedCell
        if (isRenderCell(renderData)) {
          // RenderedCell
          if (process.env.NODE_ENV !== "production") {
            warning(false, "");
          }

          returnChildNode = renderData.children;
          returnCellProps = renderData.props;
        } else {
          // ReactNode
          returnChildNode = renderData;
        }
      }
      return [returnChildNode, returnCellProps];
    },
    [record, children, dataIndex, render, renderIndex],
    (prev, next) => {
      // 如果存在更新依据，则以其返回值作为shouldUpdate的返回值
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
