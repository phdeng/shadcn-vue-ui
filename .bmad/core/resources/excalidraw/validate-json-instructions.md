# JSON 验证说明

## 目的

保存后验证 Excalidraw JSON 文件以捕获语法错误（缺少逗号、括号、引号）。

## 如何验证

使用 Node.js 内置的 JSON 解析来验证文件：

```bash
node -e "JSON.parse(require('fs').readFileSync('FILE_PATH', 'utf8')); console.log('✓ 有效的 JSON')"
```

将 `FILE_PATH` 替换为实际文件路径。

## 退出代码

- 退出代码 0 = 有效的 JSON
- 退出代码 1 = 无效的 JSON（语法错误）

## 错误输出

如果无效，Node.js 将输出：

- 带描述的错误消息
- 文件中错误发生的位置
- 行和列信息（如果可用）

## 常见错误和修复

### 缺少逗号

```
SyntaxError: Expected ',' or '}' after property value
```

**修复：** 在属性值后添加逗号

### 缺少括号/花括号

```
SyntaxError: Unexpected end of JSON input
```

**修复：** 添加缺少的右括号 `]` 或花括号 `}`

### 多余的逗号（尾随）

```
SyntaxError: Unexpected token ,
```

**修复：** 删除 `]` 或 `}` 之前的尾随逗号

### 缺少引号

```
SyntaxError: Unexpected token
```

**修复：** 在字符串值周围添加缺少的引号

## 工作流集成

保存 Excalidraw 文件后，运行验证：

1. 保存文件
2. 运行：`node -e "JSON.parse(require('fs').readFileSync('{{save_location}}', 'utf8')); console.log('✓ 有效的 JSON')"`
3. 如果验证失败：
   - 读取错误消息中的行/位置
   - 在该位置打开文件
   - 修复语法错误
   - 保存并重新验证
4. 重复直到验证通过

## 关键规则

**永远不要因为验证错误而删除文件 - 始终在报告的位置修复语法错误。**
