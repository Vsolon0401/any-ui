---
# title: 自定义页面名称
# order: 控制页面顺序，数字越小越靠前，默认以路径长度和字典序排序
nav:
  title: 组件
group:
  title: 数据录入：
---

# Checkbox 多选器

## 基础使用

```jsx
import { Checkbox } from "@any_ui/core";
import { useRef } from "react";

const App = () => {
  const inputRef = useRef(null);

  const onChange = (e) => {
    console.log(e.target.checked);
  };
  return (
    <Checkbox onChange={onChange} ref={inputRef}>
      Checkbox
    </Checkbox>
  );
};
export default App;
```

## 禁用

```jsx
import { Checkbox } from "@any_ui/core";

const onChange = (e) => {
  console.log(e.target.checked);
};
const App = () => <Checkbox disabled>disabled</Checkbox>;
export default App;
```

## 全选

```jsx
import { Checkbox } from "@any_ui/core";
import React from "react";
import { useState } from "react";
import { useRef } from "react";

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];

const App = () => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(!e.target.checked);
  };

  return (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        Check all
      </Checkbox>
      <Checkbox.Group
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </>
  );
};
export default App;
```

## 复选框组

```jsx
import { Checkbox } from "@any_ui/core";

import React from "react";

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];

const App = () => {
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  return (
    <>
      <Checkbox.Group
        options={plainOptions}
        defaultValue={["Apple"]}
        onChange={onChange}
      />
    </>
  );
};

export default App;
```

## API

### Checkbox

|      参数      |            说明            |                    类型                     | 默认值 |
| :------------: | :------------------------: | :-----------------------------------------: | :----: |
| defaultChecked |     复选框初始选中状态     |                  `boolean`                  | false  |
|    checked     |         是否被选中         |                  `boolean`                  | false  |
| indeterminate  |      是否启用混合模式      |                  `boolean`                  | false  |
|    disabled    |       是否禁用复选框       |                  `boolean`                  | false  |
|    onChange    | 定义复选框触发时的回调函数 |     `(e: CheckboxChangeEvent) => void`      |   --   |
|    onClick     |   点击复选框时的回调函数   | `(e: MouseEvent<HTMLInputElement>) => void` |   --   |
|    onFocus     |    获取焦点时的回调函数    | `(e: FocusEvent<HTMLInputElement>) => void` |   --   |
|     onBlur     |    移除焦点时的回调函数    | `(e: FocusEvent<HTMLInputElement>) => void` |   --   |

### Checkbox Group

|     参数     |            说明            |                类型                | 默认值 |
| :----------: | :------------------------: | :--------------------------------: | :----: |
| defaultValue |       默认选中的选项       |  `(string / number / boolean)[]`   |   []   |
|   disabled   |      是否禁用复选框组      |             `boolean`              | false  |
|    option    |         定义可选项         |  `string[] / number[] / Option[]`  |   []   |
|    value     |         选中的选项         |       `(string / number)[]`        |   []   |
|   onChange   | 定义复选框触发时的回调函数 | `(e: CheckboxChangeEvent) => void` |   --   |
