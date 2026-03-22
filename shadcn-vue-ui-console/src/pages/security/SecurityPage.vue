<script setup lang="ts">
/**
 * @description 安全合规中心 — 审计日志、合规标签、安全策略管理
 * @author Timon
 */
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Input } from '@ui/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { Switch } from '@ui/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ui/components/ui/tabs'
import { Separator } from '@ui/components/ui/separator'
import { Textarea } from '@ui/components/ui/textarea'
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import {
  FlaskConical,
  Plus,
  ScrollText,
  Search,
  Settings,
  Shield,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== Tab 1: 审计日志 ====================

type AuditAction = '创建' | '修改' | '删除' | '登录' | '部署'
type AuditStatus = '成功' | '失败'

interface AuditLog {
  id: string
  time: string
  operator: string
  action: AuditAction
  target: string
  ip: string
  status: AuditStatus
}

const auditSearchQuery = ref('')
const auditActionFilter = ref<string>('all')

const auditLogs = ref<AuditLog[]>([
  { id: 'a1', time: '2026-03-22 14:32:05', operator: '张伟', action: '部署', target: 'Qwen2.5-72B 生产环境', ip: '10.0.1.42', status: '成功' },
  { id: 'a2', time: '2026-03-22 13:18:22', operator: '李明', action: '登录', target: '控制台', ip: '192.168.1.105', status: '成功' },
  { id: 'a3', time: '2026-03-22 12:45:10', operator: '王芳', action: '创建', target: '客服对话数据集', ip: '10.0.2.88', status: '成功' },
  { id: 'a4', time: '2026-03-22 11:30:55', operator: '赵磊', action: '修改', target: 'API 速率限制策略', ip: '10.0.1.15', status: '成功' },
  { id: 'a5', time: '2026-03-22 10:12:33', operator: '陈静', action: '删除', target: '过期训练快照 v1.2', ip: '10.0.3.201', status: '成功' },
  { id: 'a6', time: '2026-03-21 23:55:18', operator: '未知用户', action: '登录', target: '控制台', ip: '203.0.113.45', status: '失败' },
  { id: 'a7', time: '2026-03-21 20:08:41', operator: '刘洋', action: '部署', target: 'DeepSeek-V3 测试环境', ip: '10.0.1.42', status: '失败' },
  { id: 'a8', time: '2026-03-21 18:30:12', operator: '张伟', action: '创建', target: '文档摘要 LoRA 训练任务', ip: '10.0.1.42', status: '成功' },
  { id: 'a9', time: '2026-03-21 15:22:07', operator: '李明', action: '修改', target: '内容安全审核策略', ip: '192.168.1.105', status: '成功' },
  { id: 'a10', time: '2026-03-21 09:45:30', operator: '王芳', action: '删除', target: '测试用 API Key', ip: '10.0.2.88', status: '成功' },
])

const auditActions: AuditAction[] = ['创建', '修改', '删除', '登录', '部署']

/** 根据搜索和筛选过滤审计日志 */
const filteredAuditLogs = computed(() => {
  let result = auditLogs.value
  const query = auditSearchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      log =>
        log.operator.toLowerCase().includes(query)
        || log.target.toLowerCase().includes(query)
        || log.ip.includes(query),
    )
  }
  if (auditActionFilter.value !== 'all') {
    result = result.filter(log => log.action === auditActionFilter.value)
  }
  return result
})

// ==================== Tab 2: 合规标签 ====================

type ComplianceStatus = '已审核' | '待审核' | '不合规'
type ResourceType = '模型' | '部署' | '数据集'

interface ComplianceTag {
  id: string
  resourceName: string
  resourceType: ResourceType
  status: ComplianceStatus
  reviewer: string
  reviewTime: string
}

const complianceTags = ref<ComplianceTag[]>([
  { id: 'c1', resourceName: 'Qwen2.5-72B', resourceType: '模型', status: '已审核', reviewer: '张伟', reviewTime: '2026-03-20' },
  { id: 'c2', resourceName: 'DeepSeek-V3', resourceType: '模型', status: '已审核', reviewer: '李明', reviewTime: '2026-03-18' },
  { id: 'c3', resourceName: '客服模型 v2 部署', resourceType: '部署', status: '待审核', reviewer: '—', reviewTime: '—' },
  { id: 'c4', resourceName: '客服对话数据集', resourceType: '数据集', status: '已审核', reviewer: '王芳', reviewTime: '2026-03-15' },
  { id: 'c5', resourceName: 'GPT-4o', resourceType: '模型', status: '不合规', reviewer: '赵磊', reviewTime: '2026-03-12' },
  { id: 'c6', resourceName: '代码审查模型部署', resourceType: '部署', status: '待审核', reviewer: '—', reviewTime: '—' },
  { id: 'c7', resourceName: '产品文档数据集', resourceType: '数据集', status: '已审核', reviewer: '陈静', reviewTime: '2026-03-10' },
  { id: 'c8', resourceName: 'Claude 3.5 测试部署', resourceType: '部署', status: '不合规', reviewer: '刘洋', reviewTime: '2026-03-08' },
])

const complianceStatusConfig: Record<ComplianceStatus, { badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline', badgeClass: string }> = {
  '已审核': { badgeVariant: 'secondary', badgeClass: 'bg-success/10 text-success border-0' },
  '待审核': { badgeVariant: 'secondary', badgeClass: 'bg-warning/10 text-warning border-0' },
  '不合规': { badgeVariant: 'secondary', badgeClass: 'bg-destructive/10 text-destructive border-0' },
}

// ==================== Tab 3: Guardrails 规则引擎 ====================

type RulePriority = '高' | '中' | '低'

interface GuardrailRule {
  id: string
  name: string
  condition: string
  action: string
  scope: string
  priority: RulePriority
  hitCount: number
  enabled: boolean
}

const guardrailRules = ref<GuardrailRule[]>([
  { id: 'r1', name: '输入内容过滤', condition: '检测到敏感词或违规内容时拦截', action: '拒绝并返回提示信息', scope: '全部模型', priority: '高', hitCount: 127, enabled: true },
  { id: 'r2', name: '输出安全审核', condition: '审核模型输出的安全性', action: '替换为安全内容', scope: '全部模型', priority: '高', hitCount: 43, enabled: true },
  { id: 'r3', name: 'PII 脱敏', condition: '检测个人身份信息(姓名/身份证/手机号)', action: '自动脱敏处理', scope: '客服模型', priority: '中', hitCount: 256, enabled: true },
  { id: 'r4', name: 'Token 限制', condition: '单次请求超过 8192 Token', action: '截断并警告', scope: '全部模型', priority: '低', hitCount: 12, enabled: false },
  { id: 'r5', name: 'Prompt 注入防护', condition: '检测 Prompt 注入攻击模式', action: '拒绝请求', scope: '全部模型', priority: '高', hitCount: 8, enabled: true },
  { id: 'r6', name: '版权内容过滤', condition: '检测可能的版权内容生成', action: '添加免责声明', scope: '内容生成模型', priority: '中', hitCount: 31, enabled: false },
])

/** 规则优先级样式配置 */
const priorityConfig: Record<RulePriority, string> = {
  '高': 'bg-destructive/10 text-destructive',
  '中': 'bg-warning/10 text-warning',
  '低': 'bg-muted text-muted-foreground',
}

/** 规则测试输入 */
const ruleTestInput = ref('')
const ruleTestResult = ref<{ ruleName: string, action: string }[]>([])
const ruleTestExecuted = ref(false)

/** 创建规则 */
function handleCreateRule() {
  toast.success('规则创建功能开发中')
}

/** 执行规则测试 */
function handleRuleTest() {
  if (!ruleTestInput.value.trim()) {
    toast.warning('请输入测试内容')
    return
  }
  // Mock 返回 2 条命中结果
  ruleTestResult.value = [
    { ruleName: '输入内容过滤', action: '拒绝并返回提示信息' },
    { ruleName: 'PII 脱敏', action: '自动脱敏处理' },
  ]
  ruleTestExecuted.value = true
  toast.success('规则测试完成，命中 2 条规则')
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="space-y-2">
        <Skeleton class="h-8 w-32" />
        <Skeleton class="h-4 w-72" />
      </div>
      <Skeleton class="h-10 w-80" />
      <Skeleton class="h-[480px] rounded-xl" />
    </div>

    <div v-else>
    <!-- 页面头部 -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold tracking-tight">安全合规</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        审计日志、合规标签与安全策略管理，确保 AI 应用符合监管要求
      </p>
    </div>

    <!-- Tab 布局 -->
    <Tabs default-value="audit" class="space-y-6">
      <TabsList>
        <TabsTrigger value="audit" class="gap-1.5">
          <ScrollText class="size-4" />
          审计日志
        </TabsTrigger>
        <TabsTrigger value="compliance" class="gap-1.5">
          <Shield class="size-4" />
          合规标签
        </TabsTrigger>
        <TabsTrigger value="policies" class="gap-1.5">
          <Settings class="size-4" />
          安全策略
        </TabsTrigger>
      </TabsList>

      <!-- Tab 1: 审计日志 -->
      <TabsContent value="audit">
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-[15px] font-semibold">操作日志</CardTitle>
              <div class="flex items-center gap-3">
                <!-- 操作类型筛选 -->
                <Select v-model="auditActionFilter">
                  <SelectTrigger class="w-32 h-9 rounded-xl text-xs">
                    <SelectValue placeholder="操作类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem v-for="action in auditActions" :key="action" :value="action">
                      {{ action }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <!-- 搜索 -->
                <div class="relative w-56">
                  <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input v-model="auditSearchQuery" placeholder="搜索操作人、资源..." class="pl-9 h-9 rounded-xl text-xs" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">时间</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">操作人</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">操作类型</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">目标资源</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">IP 地址</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="log in filteredAuditLogs" :key="log.id">
                  <TableCell class="text-xs text-muted-foreground tabular-nums">{{ log.time }}</TableCell>
                  <TableCell class="text-sm">{{ log.operator }}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" class="text-[11px] font-medium border-0 bg-muted">
                      {{ log.action }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-sm">{{ log.target }}</TableCell>
                  <TableCell class="text-xs text-muted-foreground font-mono tabular-nums">{{ log.ip }}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      :class="cn(
                        'text-[11px] font-medium border-0',
                        log.status === '成功' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
                      )"
                    >
                      {{ log.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 2: 合规标签 -->
      <TabsContent value="compliance">
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader class="pb-3">
            <CardTitle class="text-[15px] font-semibold">合规标签</CardTitle>
            <CardDescription class="text-[13px]">
              为模型和部署服务标记合规状态，追踪审核进度
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">资源名称</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">资源类型</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">合规状态</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">审核人</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider">审核时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="tag in complianceTags" :key="tag.id">
                  <TableCell class="font-medium text-sm">{{ tag.resourceName }}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" class="text-[11px] font-medium border-0 bg-muted">
                      {{ tag.resourceType }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      :variant="complianceStatusConfig[tag.status].badgeVariant"
                      :class="cn('text-[11px] font-medium', complianceStatusConfig[tag.status].badgeClass)"
                    >
                      {{ tag.status }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-sm text-muted-foreground">{{ tag.reviewer }}</TableCell>
                  <TableCell class="text-xs text-muted-foreground tabular-nums">{{ tag.reviewTime }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 3: Guardrails 规则引擎 -->
      <TabsContent value="policies">
        <div class="space-y-6">
          <!-- 顶部操作栏 -->
          <div class="flex items-end justify-between">
            <div>
              <h3 class="text-[15px] font-semibold">Guardrails 规则引擎</h3>
              <p class="mt-1 text-[13px] text-muted-foreground">
                定义输入输出安全规则，实时拦截违规内容与异常请求
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" class="gap-1.5 rounded-xl" @click="handleRuleTest">
                <FlaskConical class="size-3.5" />
                规则测试
              </Button>
              <Button size="sm" class="gap-1.5 rounded-xl" @click="handleCreateRule">
                <Plus class="size-3.5" />
                创建规则
              </Button>
            </div>
          </div>

          <!-- 规则列表 -->
          <div class="space-y-3">
            <div
              v-for="rule in guardrailRules"
              :key="rule.id"
              :class="cn(
                'border border-border/40 bg-card/80 rounded-xl p-5 transition-opacity',
                rule.enabled ? 'border-l-[3px] border-l-success' : 'opacity-60',
              )"
            >
              <!-- 头部：名称 + 开关 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    :class="cn(
                      'size-2 rounded-full shrink-0',
                      rule.enabled ? 'bg-success' : 'bg-muted-foreground',
                    )"
                  />
                  <h4 class="text-sm font-semibold">{{ rule.name }}</h4>
                </div>
                <Switch v-model:checked="rule.enabled" />
              </div>

              <!-- 条件与动作 -->
              <div class="mt-3 space-y-1.5 pl-4">
                <p class="text-[13px] text-muted-foreground">
                  <span class="text-foreground/70 font-medium">触发条件：</span>{{ rule.condition }}
                </p>
                <p class="text-[13px] text-muted-foreground">
                  <span class="text-foreground/70 font-medium">处理方式：</span>{{ rule.action }}
                </p>
              </div>

              <!-- 底部信息 -->
              <Separator class="my-3" />
              <div class="flex items-center gap-4 pl-4 text-xs text-muted-foreground">
                <span>作用范围：<span class="text-foreground/80">{{ rule.scope }}</span></span>
                <span class="text-border">|</span>
                <span>
                  优先级：
                  <Badge
                    variant="secondary"
                    :class="cn('text-[11px] font-medium border-0 ml-0.5', priorityConfig[rule.priority])"
                  >
                    {{ rule.priority }}
                  </Badge>
                </span>
                <span class="text-border">|</span>
                <span>命中：<span class="font-mono tabular-nums text-foreground/80">{{ rule.hitCount }}</span> 次</span>
              </div>
            </div>
          </div>

          <!-- 规则测试区域 -->
          <Separator />
          <div class="space-y-4">
            <h3 class="text-[15px] font-semibold">规则测试</h3>
            <Textarea
              v-model="ruleTestInput"
              placeholder="输入测试内容，验证规则是否正确触发..."
              class="min-h-[100px] rounded-xl resize-none"
            />
            <div class="flex items-center justify-between">
              <Button size="sm" class="gap-1.5 rounded-xl" @click="handleRuleTest">
                <FlaskConical class="size-3.5" />
                测试
              </Button>
            </div>

            <!-- 测试结果 -->
            <div v-if="ruleTestExecuted" class="space-y-2">
              <p class="text-[13px] font-medium text-foreground/80">
                命中规则（{{ ruleTestResult.length }} 条）
              </p>
              <div
                v-for="(result, idx) in ruleTestResult"
                :key="idx"
                class="flex items-center gap-3 border border-border/40 bg-card/80 rounded-lg px-4 py-3"
              >
                <span class="size-2 rounded-full bg-destructive shrink-0" />
                <span class="text-sm font-medium">{{ result.ruleName }}</span>
                <span class="text-xs text-muted-foreground">→ {{ result.action }}</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
    </div>
  </div>
</template>
