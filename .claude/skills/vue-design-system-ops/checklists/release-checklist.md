# 发布前检查清单

## 代码质量
- [ ] `yarn lint` 通过，无 error
- [ ] `yarn build` 所有子项目构建成功
- [ ] TypeScript 无编译错误
- [ ] 无 console.log 或调试代码残留

## 测试
- [ ] 所有单元测试通过
- [ ] 新增功能有对应测试覆盖
- [ ] 修改的组件在亮/暗模式下手动验证

## 文档
- [ ] CHANGELOG.md 已更新
- [ ] 新组件有使用文档
- [ ] Breaking changes 有迁移指南
- [ ] README 中的组件清单是否需要更新

## 兼容性
- [ ] 两个子项目（console + business）都正常运行
- [ ] 无新的浏览器兼容性问题
- [ ] 响应式布局正常

## 版本号
- [ ] 版本号遵循 semver
- [ ] Breaking changes → major
- [ ] 新功能 → minor
- [ ] Bug 修复 → patch

## 依赖
- [ ] 无新增的不必要依赖
- [ ] 依赖版本是否需要锁定
- [ ] yarn.lock 已更新

## 最终确认
- [ ] git status 干净
- [ ] 所有变更都已 commit
- [ ] commit message 使用中文
- [ ] PR 描述清晰完整
