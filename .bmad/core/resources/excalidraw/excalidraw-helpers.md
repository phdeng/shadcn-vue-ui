# Excalidraw 元素创建指南

## 文本宽度计算

对于形状内的文本元素（标签）：

```
text_width = (text.length × fontSize × 0.6) + 20
```

四舍五入到最接近的 10 以对齐网格。

## 元素分组规则

**关键：** 创建带标签的形状时：

1. 生成唯一 ID：
   - `shape-id` 用于形状
   - `text-id` 用于文本
   - `group-id` 用于组

2. 形状元素必须有：
   - `groupIds: [group-id]`
   - `boundElements: [{type: "text", id: text-id}]`

3. 文本元素必须有：
   - `containerId: shape-id`
   - `groupIds: [group-id]`（与形状相同）
   - `textAlign: "center"`
   - `verticalAlign: "middle"`
   - `width: calculated_width`

## 网格对齐

- 将所有 `x`、`y` 坐标对齐到 20px 网格
- 公式：`Math.round(value / 20) * 20`
- 元素之间的间距：最小 60px

## 箭头创建

### 直线箭头

用于正向流（从左到右，从上到下）：

```json
{
  "type": "arrow",
  "startBinding": {
    "elementId": "source-shape-id",
    "focus": 0,
    "gap": 10
  },
  "endBinding": {
    "elementId": "target-shape-id",
    "focus": 0,
    "gap": 10
  },
  "points": [[0, 0], [distance_x, distance_y]]
}
```

### 折线箭头

用于向上流、向后流或复杂路由：

```json
{
  "type": "arrow",
  "startBinding": {...},
  "endBinding": {...},
  "points": [
    [0, 0],
    [intermediate_x, 0],
    [intermediate_x, intermediate_y],
    [final_x, final_y]
  ],
  "elbowed": true
}
```

### 更新连接的形状

创建箭头后，更新两个连接形状上的 `boundElements`：

```json
{
  "id": "shape-id",
  "boundElements": [
    { "type": "text", "id": "text-id" },
    { "type": "arrow", "id": "arrow-id" }
  ]
}
```

## 主题应用

主题颜色应一致应用：

- **形状**：`backgroundColor` 来自主题主填充色
- **边框**：`strokeColor` 来自主题强调色
- **文本**：`strokeColor` = "#1e1e1e"（深色文本）
- **箭头**：`strokeColor` 来自主题强调色

## 验证清单

保存前验证：

- [ ] 所有带标签的形状都有匹配的 `groupIds`
- [ ] 所有文本元素都有指向父形状的 `containerId`
- [ ] 文本宽度计算正确（无截断）
- [ ] 设置了文本对齐（`textAlign` + `verticalAlign`）
- [ ] 所有元素对齐到 20px 网格
- [ ] 所有箭头都有 `startBinding` 和 `endBinding`
- [ ] 连接形状上的 `boundElements` 数组已更新
- [ ] 主题颜色一致应用
- [ ] 最终输出中没有元数据或历史记录
- [ ] 所有 ID 都是唯一的

## 优化

从最终输出中移除：

- `appState` 对象
- `files` 对象（除非使用了图片）
- 所有 `isDeleted: true` 的元素
- 未使用的库项目
- 版本历史
