import * as React from "react";

export interface AbstractSelectProps {
  id: string;
  prefixCls: string;
  classNames: string;
  open: boolean;
  title?: string;

  mode: any;

  inputRef: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  values: any[];
  showSearch?: boolean;
  searchValue: string;
  autoClearSearchValue?: boolean;
  activeDescendantId?: string;

  onInputKeyDown: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onInputMouseDown: React.MouseEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onInputPaste: React.ClipboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onInputCompositionStart: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onInputCompositionEnd: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;

  onToggleOpen: (open?: boolean) => void;
  onSearch: () => void;
}

export interface RefSelectorProps {
  focus: () => void;
  blur: () => void;
  scrollTo?: any;
}
