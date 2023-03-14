import { useState } from "react";
import * as React from "react";
import classnames from "classnames";
import { zh_CH_locale as locale } from "./locale";
import warning from "../_util/warning";

export interface PaginationOptionsProps {
  prefixCls?: string;
  pageSize?: number;
  selectPrefixCls?: string;
  SelectComponent?: any;
  disabled?: boolean;
  pageSizeOptions?: (string | number)[];
  goButton?: any;
  quickGo?: (page: any) => number | string;
  changeSize?: any;
  buildOptionText?: any;
}

const defaultPageSizeOptions = ["10", "20", "50", "100"];

const PaginationOptions: React.FC<PaginationOptionsProps> = ({
  prefixCls,
  pageSize = 10,
  selectPrefixCls,
  SelectComponent,
  disabled,
  pageSizeOptions = defaultPageSizeOptions,
  goButton,
  quickGo,
  changeSize,
  buildOptionText,
}) => {
  const [goInputText, setGoInputText] = useState<number | string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeSize(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoInputText(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (goButton || !goInputText) {
      return;
    }
    setGoInputText("");

    if (e.relatedTarget) return;
    if (isNaN(Number(goInputText))) {
      warning(
        true,
        "pagination",
        "Make sure that the input value is of the number type"
      );
    } else {
      quickGo?.(Number(goInputText));
    }
  };

  const handleSkip = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (goInputText === "") return;

    if (e.type === "click" || e.keyCode === 13) {
      setGoInputText("");
      if (isNaN(Number(goInputText))) {
        warning(
          true,
          "pagination",
          "Make sure that the input value is of the number type"
        );
      } else {
        quickGo?.(Number(goInputText));
      }
    }
  };

  const getPageSizeOption = () => {
    if (
      pageSizeOptions.some(
        (option: any) => option.toString() === pageSize.toString()
      )
    ) {
      return pageSizeOptions;
    }
  };

  const fixCls = `${prefixCls}-options`;
  const optionCls = classnames(fixCls);

  return (
    <li className={optionCls}>
      {changeSize && SelectComponent && (
        <SelectComponent
          disabled={disabled}
          prefixCls={selectPrefixCls}
          classNames={`${fixCls}-size-changer`}
          optionLabelProp="children"
          dropdownMatchSelectWidth={false}
          value={(pageSize || pageSizeOptions[0]).toString()}
          onChange={onChange}
          getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
          aria-label={locale.page_size}
          defaultOpen={false}
        >
          {pageSizeOptions.map((opt, idx) => (
            <SelectComponent.Option key={idx} value={opt.toString()}>
              {buildOptionText(opt)}
            </SelectComponent.Option>
          ))}
        </SelectComponent>
      )}
      {quickGo !== undefined && (
        <div className={`${fixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            disabled={disabled}
            type="text"
            value={goInputText}
            onChange={handleChange}
            onKeyUp={handleSkip}
            onBlur={handleBlur}
            aria-label={locale.page}
          />
          {locale.page}
          {goButton && (
            <button
              type="button"
              onClick={() => handleSkip}
              disabled={disabled}
              className={`${fixCls}-quick-jumper-button`}
            >
              {locale.jump_to_confirm}
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default PaginationOptions;
