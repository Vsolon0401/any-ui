---
# title: 自定义页面名称
# order: 控制页面顺序，数字越小越靠前，默认以路径长度和字典序排序
nav:
  title: 组件
group:
  title: 数据展示：
---

# Tag 标签

进行标记和分类的小标签。

## 基础

```jsx
import { Tag } from "@any_ui/core";
import React from "react";

const preventDefault = (e) => {
  e.preventDefault();
  console.log("Clicked! But prevent default.");
};

export default () => (
  <>
    <Tag color={"#f50"}>Tag 1</Tag>
    <Tag color={"success"}>Tag 2</Tag>
    <Tag color={"processing"}>Tag 3</Tag>
    <Tag color={"error"}>Tag 4</Tag>
    <Tag color={"warning"}>Tag 5</Tag>
    <Tag closeable onClose={preventDefault}>
      Tag 2
    </Tag>
  </>
);
```

## 多色彩

```jsx
import { Tag } from "@any_ui/core";

export default () => (
  <span>
    <Tag color={"red"}>red</Tag>
    <Tag color={"blue"}>blue</Tag>
    <Tag color={"purple"}>purple</Tag>
  </span>
);
```

## 预设状态

```jsx
import { Tag } from "@any_ui/core";

export default () => (
  <span>
    <Tag color={"success"}>success</Tag>
    <Tag color={"processing"}>processing</Tag>
    <Tag color={"error"}>error</Tag>
    <Tag color={"default"}>default</Tag>
    <Tag color={"warning"}>warning</Tag>
  </span>
);
```

### Tag API

| 参数      | 说明                             | 类型          | 默认值 |
| --------- | -------------------------------- | ------------- | ------ |
| closable  | 标签是否可以关闭（点击默认关闭） | `boolean`     | false  |
| closeIcon | 自定义关闭按钮                   | `ReactNode`   | -      |
| color     | 标签色                           | `string`      | -      |
| icon      | 设置图标                         | `ReactNode`   | -      |
| onClose   | 关闭时的回调                     | `(e) => void` | -      |

### Tag.TagEvent

| 参数     | 说明                 | 类型          | 默认值 |
| -------- | -------------------- | ------------- | ------ |
| checked  | 设置标签的选中状态   | `boolean`     | false  |
| onChange | 点击标签时触发的回调 | `(e) => void` | -      |
