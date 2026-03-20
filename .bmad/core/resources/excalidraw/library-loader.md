# 外部库加载器

**状态：** 未来实现的占位符

## 目的

从 <https://libraries.excalidraw.com> 或自定义来源加载外部 .excalidrawlib 文件。

## 计划功能

- 通过 URL 加载库
- 从本地文件加载库
- 合并多个库
- 过滤库组件
- 缓存已加载的库

## API 参考

将记录如何使用：

- `importLibrary(url)` - 从 URL 加载库
- `loadSceneOrLibraryFromBlob()` - 从文件加载
- `mergeLibraryItems()` - 合并库

## 使用示例

```yaml
# 未来 workflow.yaml 结构
libraries:
  - url: 'https://libraries.excalidraw.com/libraries/...'
    filter: ['aws', 'cloud']
  - path: '{project-root}/_data/custom-library.excalidrawlib'
```

## 实现说明

当 Agent 需要利用 <https://libraries.excalidraw.com> 上提供的广泛库生态系统时，将开发此功能。

存在数百个预构建的组件库用于：

- AWS/云图标
- UI/UX 组件
- 业务图表
- 思维导图形状
- 平面图
- 等等...

## 用户配置

未来：用户将能够在其 BMAD 配置中配置常用库以自动加载。
