import { PaginationProps } from "./interface";
import warning from "../_util/warning";
import { cloneElement, isValidElement, useEffect, useState } from "react";
import * as React from "react";
import classnames from "classnames";
import Pager from "./pager";
import { zh_CH_locale as locale } from "./locale";
import PaginationOptions from "./options";

const DOST = "•••";

const calculatePage = (
  page: number | undefined,
  pageSize: number,
  total: number
) => {
  const newPageSize = typeof page === "undefined" ? pageSize : page;
  return Math.floor((total - 1) / newPageSize) + 1;
};

const InternalPagination: React.FC<PaginationProps> = ({
  prefixCls = "ai-pagination",
  selectPrefixCls = "ai-select",
  className,
  style,
  defaultCurrent = 1,
  defaultPageSize = 10,
  total = 0,
  disabled,
  onChange,
  simple,
  hideOnSinglePage = false,
  showPrevNextJumpers = true,
  showQuickJumper = false,
  showSizeChanger,
  showLessItems = false,
  showTotal,
  showTitle = true,
  onShowSizeChange,
  itemRender = (page, type, element) => element,
  pageSizeOptions = ["10", "20", "50", "100"],
  totalBoundaryShowSizeChanger = 50,
  ...restProps
}) => {
  const [current, setCurrent] = useState<number>(
    restProps.current ? restProps.current : defaultCurrent
  );
  const [currentInputValue, setCurrentInputValue] = useState(1);
  const [pageSize, setPageSize] = useState(
    restProps.pageSize ? restProps.pageSize : defaultPageSize
  );

  const allPages = calculatePage(undefined, pageSize, total);
  const pagerList: React.ReactElement[] = [];
  let gotoButton = null;
  const goButton = showQuickJumper && typeof showQuickJumper === "object";
  const pageBufferSize = showLessItems ? 1 : 2;
  const prevPage = current - 1 > 0 ? current - 1 : 0;
  const nextPage = current + 1 < allPages ? current + 1 : allPages;

  useEffect(() => {
    warning(
      !restProps.current,
      "Pagination",
      "" +
        "Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component."
    );
  }, []);

  const shouldShowQuickJump = () =>
    total <= pageSize ? false : showQuickJumper;
  // 工具函数
  const getJumpPrevPage = () => Math.max(1, current - (showLessItems ? 3 : 5));

  const getJumpNextPage = () =>
    Math.min(
      calculatePage(undefined, pageSize, total),
      current + (showLessItems ? 3 : 5)
    );

  const getValidValue = (e: any) => {
    let validValue;
    const inputValue = e.target.value;
    const allPages = calculatePage(undefined, pageSize, total);
    if (!inputValue) {
      validValue = inputValue;
    } else if (isNaN(Number(inputValue))) {
      validValue = currentInputValue;
    } else if (inputValue >= allPages) {
      validValue = allPages;
    } else {
      validValue = Number(inputValue);
    }
    return validValue;
  };

  // 事件处理
  const handleChange = (page: number) => {
    if (!disabled) {
      const currentPage = calculatePage(undefined, pageSize, total);
      let newPage = page;
      if (currentPage < page) {
        newPage = currentPage;
      } else if (page < 1) {
        newPage = 1;
      }
      if (!("current" in restProps)) {
        setCurrent(newPage);
      }
      if (newPage !== currentInputValue) {
        setCurrentInputValue(newPage);
      }
      onChange?.(newPage as number, pageSize);
      return newPage;
    }
    return current;
  };

  const handleKeyUp = (e: any) => {
    const value = getValidValue(e);
    if (value !== currentInputValue) {
      setCurrentInputValue(value);
    }
    if (e.keyCode === 13) {
      handleChange(value);
    } else if (e.keyCode === 38) {
      handleChange(value);
    } else if (e.keyCode === 40) {
      handleChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 可使用code来替代，但目前浏览器支持较少
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  const handleEnter = (event: any, callback: any, ...restParams: any[]) => {
    if (event.key === "Enter" || event.charCode === 13) {
      callback(...restParams);
    }
  };

  const handleBlur = (e: any) => {
    const value = getValidValue(e);
    handleChange(value);
  };

  const handleSkipTo = (e: any) => {
    if (e.keyCode === 13 || e.type === "click") {
      handleChange(currentInputValue);
    }
  };

  const changeSize = (size: number) => {
    const getCurrent = calculatePage(size, pageSize, total);
    const newCurrent = current > getCurrent ? getCurrent : current;
    if (newCurrent > 0) setCurrent(newCurrent);
    if (!("pageSize" in restProps)) {
      setPageSize(size);
    }
    if (!("current" in restProps)) {
      setCurrent(current);
      setCurrentInputValue(current);
    }

    onShowSizeChange?.(current, size);
    onChange?.(current, size);
  };

  // 跳转处理
  const onPrev = () => {
    if (current > 1) handleChange(current - 1);
  };

  const onNext = () => {
    if (current < calculatePage(undefined, pageSize, total)) {
      handleChange(current + 1);
    }
  };

  const onJumpPrev = () => {
    handleChange(getJumpPrevPage());
  };

  const onJumpNext = () => {
    handleChange(getJumpNextPage());
  };

  const onEnterPrev = (e: any) => handleEnter(e, onPrev);

  const onEnterNext = (e: any) => handleEnter(e, onNext);

  const onEnterJumpPrev = (e: any) => handleEnter(e, onJumpPrev);

  const onEnterJumpNext = (e: any) => handleEnter(e, onJumpNext);

  // 样式处理
  const getIcon = () => {
    const prevEllipsis = <span className={`${prefixCls}-icon`}>&#60;</span>;
    const nextEllipsis = <span className={`${prefixCls}-icon`}>&#62;</span>;
    const ellipsis = (
      <span className={`${prefixCls}-item-ellipsis`}>{DOST}</span>
    );
    const prevIcon = (
      <button
        className={`${prefixCls}-item-link`}
        type={"button"}
        tabIndex={-1}
      >
        {prevEllipsis}
      </button>
    );

    const nextIcon = (
      <button
        className={`${prefixCls}-item-link`}
        type={"button"}
        tabIndex={-1}
      >
        {nextEllipsis}
      </button>
    );

    const jumpPrevIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>{ellipsis}</div>
      </a>
    );

    const jumpNextIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>{ellipsis}</div>
      </a>
    );

    return {
      prevIcon,
      nextIcon,
      jumpPrevIcon,
      jumpNextIcon,
    };
  };

  const { prevIcon, nextIcon, jumpPrevIcon, jumpNextIcon } = getIcon();

  const renderPrev = (prevPage: number) => {
    const prevButton = itemRender?.(prevPage, "prev", prevIcon);
    const disabled = current <= 1;
    return isValidElement(prevButton)
      ? cloneElement(prevButton as React.ReactElement<HTMLButtonElement>, {
          disabled,
        })
      : prevButton;
  };

  const renderNext = (nextPage: number) => {
    const nextButton = itemRender?.(nextPage, "next", nextIcon);
    const disabled = current >= allPages;
    return isValidElement(nextButton)
      ? cloneElement(nextButton as React.ReactElement<HTMLButtonElement>, {
          disabled,
        })
      : nextButton;
  };

  const getShowSizeChanger = () => {
    if (typeof showSizeChanger !== "undefined") {
      return showSizeChanger;
    }
    return total > totalBoundaryShowSizeChanger;
  };

  const ulCls = classnames(
    prefixCls,
    {
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );
  const prevCls = classnames(`${prefixCls}-prev`, {
    [`${prefixCls}-disabled`]: current <= 1,
  });
  const nextCls = classnames(`${prefixCls}-next`, {
    [`${prefixCls}-disabled`]: current >= allPages,
  });

  // 页面渲染
  if (allPages <= 3 + pageBufferSize * 2) {
    if (!allPages) {
      pagerList.push(
        <Pager
          prefixCls={prefixCls}
          showTitle={showTitle}
          key={"noPager"}
          page={1}
          itemRender={itemRender}
          onClick={handleChange}
          onKeyPress={handleEnter}
        />
      );
    }

    for (let i = 1; i <= allPages; i += 1) {
      const active = current === i;
      pagerList.push(
        <Pager
          prefixCls={prefixCls}
          active={active}
          showTitle={showTitle}
          key={i}
          page={i}
          itemRender={itemRender}
          onClick={handleChange}
          onKeyPress={handleEnter}
        />
      );
    }
  } else {
    const prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
    const nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;

    const jumpPrev = (
      <li
        title={showTitle ? prevItemTitle : undefined}
        key="prev"
        onClick={onJumpPrev}
        tabIndex={0}
        onKeyPress={onEnterJumpPrev}
        className={classnames(`${prefixCls}-jump-prev`, {
          [`${prefixCls}-jump-prev-custom-icon`]: !!jumpPrevIcon,
        })}
      >
        {itemRender(getJumpPrevPage(), "jump-prev", jumpPrevIcon)}
      </li>
    );

    const jumpNext = (
      <li
        title={showTitle ? nextItemTitle : undefined}
        key="next"
        onClick={onJumpNext}
        tabIndex={0}
        onKeyPress={onEnterJumpNext}
        className={classnames(`${prefixCls}-jump-next`, {
          [`${prefixCls}-jump-next-custom-icon`]: !!jumpPrevIcon,
        })}
      >
        {itemRender(getJumpNextPage(), "jump-next", jumpNextIcon)}
      </li>
    );

    const firstPager = (
      <Pager
        prefixCls={prefixCls}
        key={1}
        page={1}
        active={false}
        showTitle={showTitle}
        itemRender={itemRender}
        onClick={handleChange}
        onKeyPress={handleEnter}
      />
    );

    const lastPager = (
      <Pager
        prefixCls={prefixCls}
        key={allPages}
        page={allPages}
        active={false}
        showTitle={showTitle}
        itemRender={itemRender}
        onClick={handleChange}
        onKeyPress={handleEnter}
      />
    );

    let left = Math.max(1, current - pageBufferSize);
    let right = Math.min(current + pageBufferSize, allPages);

    if (current - 1 <= pageBufferSize) {
      right = 1 + pageBufferSize * 2;
    }

    if (allPages - current <= pageBufferSize) {
      left = allPages - pageBufferSize * 2;
    }

    for (let i = left; i <= right; i += 1) {
      const active = current === i;
      pagerList.push(
        <Pager
          prefixCls={prefixCls}
          onClick={handleChange}
          onKeyPress={handleEnter}
          key={i}
          page={i}
          active={active}
          showTitle={showTitle}
          itemRender={itemRender}
        />
      );
    }

    if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
      pagerList[0] = cloneElement(pagerList[0], {
        className: `${prefixCls}-item-after-jump-prev`,
      });
      pagerList.unshift(jumpPrev);
    }
    if (allPages - current >= pageBufferSize * 2 && current !== allPages - 2) {
      pagerList[pagerList.length - 1] = cloneElement(
        pagerList[pagerList.length - 1],
        {
          className: `${prefixCls}-item-before-jump-next`,
        }
      );
      pagerList.push(jumpNext);
    }

    if (left !== 1) {
      pagerList.unshift(firstPager);
    }
    if (right !== allPages) {
      pagerList.push(lastPager);
    }
  }

  const totalText = showTotal && (
    <li className={`${prefixCls}-total-text`}>
      {showTotal(total, [
        total === 0 ? 0 : (current - 1) * pageSize + 1,
        current * pageSize > total ? total : current * pageSize,
      ])}
    </li>
  );

  // 简洁模式
  if (simple) {
    if (goButton) {
      if (typeof goButton === "boolean") {
        gotoButton = (
          <button type="button" onClick={handleSkipTo} onKeyUp={handleSkipTo}>
            {locale.jump_to_confirm}
          </button>
        );
      } else {
        gotoButton = (
          <span onClick={handleSkipTo} onKeyUp={handleSkipTo}>
            {goButton as React.ReactNode}
          </span>
        );
      }
      gotoButton = (
        <li
          title={
            showTitle ? `${locale.jump_to}${current}/${allPages}` : undefined
          }
          className={`${prefixCls}-simple-pager`}
        >
          {gotoButton}
        </li>
      );
    }

    return (
      <ul
        className={classnames(
          prefixCls,
          `${prefixCls}-simple`,
          { [`${prefixCls}-disabled`]: disabled },
          className
        )}
        style={style}
      >
        {totalText}
        <li
          title={showTitle ? locale.prev_page : undefined}
          onClick={onPrev}
          tabIndex={current <= 1 ? undefined : 0}
          onKeyPress={onEnterPrev}
          className={prevCls}
        >
          {renderPrev(prevPage)}
        </li>
        <li
          title={showTitle ? `${current}/${allPages}` : undefined}
          className={`${prefixCls}-simple-pager`}
        >
          <input
            type="text"
            value={currentInputValue}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onChange={handleKeyUp}
            onBlur={handleBlur}
            size={3}
          />
          <span className={`${prefixCls}-slash`}>/</span>
          {allPages}
        </li>
        <li
          title={showTitle ? locale.next_page : undefined}
          onClick={onNext}
          tabIndex={current >= allPages ? undefined : 0}
          onKeyPress={onEnterNext}
          className={nextCls}
        >
          {renderNext(nextPage)}
        </li>
        {gotoButton}
      </ul>
    );
  }

  return (
    <ul className={ulCls} style={style}>
      {totalText}
      <li
        title={showTitle ? locale.prev_page : undefined}
        onClick={onPrev}
        onKeyPress={onEnterPrev}
        tabIndex={current <= 1 ? undefined : 0}
        className={prevCls}
      >
        {renderPrev(prevPage)}
      </li>
      {pagerList}
      <li
        title={showTitle ? locale.next_page : undefined}
        onClick={onNext}
        onKeyPress={onEnterNext}
        tabIndex={current >= allPages ? undefined : 0}
        className={nextCls}
      >
        {renderNext(nextPage)}
      </li>
      <PaginationOptions
        disabled={disabled}
        prefixCls={prefixCls}
        selectPrefixCls={selectPrefixCls}
        changeSize={getShowSizeChanger() ? changeSize : undefined}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        quickGo={shouldShowQuickJump() ? handleChange : undefined}
        goButton={goButton}
      />
    </ul>
  );
};

export default InternalPagination;
