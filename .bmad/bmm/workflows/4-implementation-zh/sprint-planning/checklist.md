# 冲刺规划验证清单

## 核心验证

### 完全覆盖检查

- [ ] 在 epic*.md 文件中找到的每个史诗都在 sprint-status.yaml 中
- [ ] 在 epic*.md 文件中找到的每个故事都在 sprint-status.yaml 中
- [ ] 每个史诗都有对应的回顾条目
- [ ] sprint-status.yaml 中没有在 epic 文件中不存在的项

### 解析验证

比较 epic 文件与生成的 sprint-status.yaml：

```
Epic 文件包含:                      冲刺状态包含:
✓ 史诗 1                             ✓ epic-1: [状态]
  ✓ 故事 1.1: 用户认证               ✓ 1-1-user-auth: [状态]
  ✓ 故事 1.2: 账户管理               ✓ 1-2-account-mgmt: [状态]
  ✓ 故事 1.3: 植物命名               ✓ 1-3-plant-naming: [状态]
                                    ✓ epic-1-retrospective: [状态]
✓ 史诗 2                             ✓ epic-2: [状态]
  ✓ 故事 2.1: 人格模型               ✓ 2-1-personality-model: [状态]
  ✓ 故事 2.2: 聊天界面               ✓ 2-2-chat-interface: [状态]
                                    ✓ epic-2-retrospective: [状态]
```

### 最终检查

- [ ] 史诗总数匹配
- [ ] 故事总数匹配
- [ ] 所有项按预期顺序（史诗、故事、回顾）
