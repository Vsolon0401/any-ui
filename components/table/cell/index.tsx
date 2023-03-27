import * as React from "react";
import TableContext from "../context/TableContext";
import type {
  AlignType,
  CellEllipsisType,
  ColumnType,
  CustomizeComponent,
  DataIndex,
  DefaultRecordType,
  ScopeType,
} from "../interface";
import { useCellRender } from "./useCellRender";
import { useHoverState } from "./useHoverState";
import classnames from "classnames";
import { useContext } from "@rc-component/context";

export interface CellProps<RecordType extends DefaultRecordType> {
  /** 单元格前缀类名 */
  prefixCls?: string;
  /** 单元格类名 */
  className?: string;
  record?: RecordType;
  /** 列索引是真实的显示行索引 */
  index?: number;
  /** 记录的索引。对于渲染（值、记录、renderIndex */
  renderIndex?: number;
  dataIndex?: DataIndex;
  /** 渲染函数*/
  render?: ColumnType<RecordType>["render"];
  component: CustomizeComponent;
  /** 单元格子节点 */
  children?: React.ReactNode;
  /** 单元格中扩展列的数量 值<1000 */
  colSpan?: number;
  /** 单元格中扩展行的数量 值<1000 */
  rowSpan?: number;
  /** 作为表头时关联的单元格 */
  scope?: ScopeType;
  ellipsis?: CellEllipsisType;
  /** 单元格内元素排列方式*/
  align?: AlignType;
  /** 单元格更新依据*/
  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

  // Fixed
  fixLeft?: number | false;
  fixRight?: number | false;
  firstFixLeft?: boolean;
  lastFixLeft?: boolean;
  firstFixRight?: boolean;
  lastFixRight?: boolean;
  allColsFixedLeft?: boolean;

  // ====================== Private Props ======================
  /** @private Used for `expandable` with nest tree */
  appendNode?: React.ReactNode;
  additionalProps?: React.TdHTMLAttributes<HTMLTableCellElement>;

  rowType?: "header" | "body" | "footer";

  isSticky?: boolean;
}

const getTitleFromCellRenderChildren = ({
  ellipsis,
  rowType,
  children,
}: Pick<CellProps<any>, "ellipsis" | "rowType" | "children">) => {
  let title: string = "";
  const ellipsisConfig: CellEllipsisType =
    ellipsis === true ? { showTitle: true } : (ellipsis as CellEllipsisType);
  if (
    ellipsisConfig &&
    ((typeof ellipsisConfig !== "boolean" && ellipsisConfig?.showTitle) ||
      rowType === "header")
  ) {
    if (typeof children === "string" || typeof children === "number") {
      title = children.toString();
    } else if (
      React.isValidElement(children) &&
      typeof children.props.children === "string"
    ) {
      title = children.props.children;
    }
  }
  return title;
};

const Cell: React.FC<CellProps<any>> = <RecordType extends DefaultRecordType>({
  component: Component,
  children,
  ellipsis,
  scope,

  // Style
  prefixCls,
  className,
  align,

  // Value
  record,
  render,
  dataIndex,
  renderIndex,
  shouldCellUpdate,

  // Row
  index,
  rowType,

  // Span
  colSpan,
  rowSpan,

  // Fixed
  fixLeft,
  fixRight,
  firstFixLeft,
  lastFixLeft,
  firstFixRight,
  lastFixRight,

  // Private
  appendNode,
  additionalProps = {},
  isSticky,
}: CellProps<RecordType>) => {
  // 单元格数据渲染
  const [childNode, cellProps] = useCellRender(
    record,
    dataIndex,
    renderIndex,
    children,
    render,
    shouldCellUpdate
  );

  // row | col 扩展处理 默认值: 1
  const mergeRowSpan =
    cellProps?.rowSpan ?? additionalProps?.rowSpan ?? rowSpan ?? 1;
  const mergeColSpan =
    cellProps?.colSpan ?? additionalProps?.colSpan ?? colSpan ?? 1;

  // Fixed
  // 从上下文中取出对Sticky的支持性
  const { supportSticky, allColumnsFixedLeft } = useContext(TableContext, [
    "supportSticky",
    "allColumnsFixedLeft",
  ]);
  const fixedStyle: React.CSSProperties = {};
  const isFixLeft = typeof fixLeft === "number" && supportSticky;
  const isFixRight = typeof fixRight === "number" && supportSticky;

  if (isFixLeft) {
    fixedStyle.position = "sticky";
    fixedStyle.left = fixLeft;
  }
  if (isFixRight) {
    fixedStyle.position = "sticky";
    fixedStyle.right = fixRight;
  }

  // hover | click
  const [hovering, onHover] = useHoverState(index, mergeRowSpan);

  const onMouseEnter: React.MouseEventHandler<HTMLTableCellElement> = (
    event
  ) => {
    if (record) {
      onHover(index, index + mergeRowSpan - 1);
    }

    additionalProps?.onMouseEnter?.(event);
  };

  const onMouseLeave: React.MouseEventHandler<HTMLTableCellElement> = (
    event
  ) => {
    if (record) {
      onHover(-1, -1);
    }

    additionalProps?.onMouseLeave?.(event);
  };

  // className 处理动态样式
  const cellPrefixCls = `${prefixCls}-cell`;
  const mergeCls = classnames(prefixCls, {
    // fixed
    [`${cellPrefixCls}-fix-left`]: isFixLeft && supportSticky,
    [`${cellPrefixCls}-fix-left-first`]: firstFixLeft && supportSticky,
    [`${cellPrefixCls}-fix-left-last`]: lastFixLeft && supportSticky,
    [`${cellPrefixCls}-fix-left-all`]:
      lastFixLeft && allColumnsFixedLeft && supportSticky,
    [`${cellPrefixCls}-fix-right`]: isFixRight && supportSticky,
    [`${cellPrefixCls}-fix-right-first`]: firstFixRight && supportSticky,
    [`${cellPrefixCls}-fix-right-last`]: lastFixRight && supportSticky,
    [`${cellPrefixCls}-fix-sticky`]:
      (isFixLeft || isFixRight) && isSticky && supportSticky,
    [`${cellPrefixCls}-ellipsis`]: ellipsis,
    [`${cellPrefixCls}-with-append`]: appendNode,
    [`${cellPrefixCls}-row-hover`]: hovering && !cellProps,
  });

  // style
  const alignStyle: React.CSSProperties = {};
  if (align) {
    alignStyle.textAlign = align;
  }

  const mergeStyle = {
    ...additionalProps.style,
    ...alignStyle,
    ...fixedStyle,
    ...cellProps?.style,
  };

  // title
  const title =
    additionalProps.title ??
    getTitleFromCellRenderChildren({
      rowType,
      ellipsis,
      children: childNode as React.ReactNode,
    });

  // row或col值为0时，不作渲染
  if (mergeRowSpan === 0 || mergeColSpan === 0) return null;

  return (
    <Component
      {...cellProps}
      {...additionalProps}
      className={mergeCls}
      scope={scope}
      title={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      colSpan={mergeColSpan !== 1 ? mergeColSpan : null}
      rowSpan={mergeRowSpan !== 1 ? mergeRowSpan : null}
    >
      {childNode}
      {appendNode}
    </Component>
  );
};

export default React.memo(Cell);
