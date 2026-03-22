<script setup lang="ts">
/**
 * @description 联邦学习 — 跨组织安全协作训练，数据不出域
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
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
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
import { cn } from '@ui/lib/utils'
import {
  Globe,
  Lock,
  Network,
  Plus,
  Shield,
  Users,
  Workflow,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== 统计数据 ====================

const stats = {
  tasks: 5,
  participants: 12,
  isolationRate: '100%',
}

// ==================== Tab 1: 联邦任务 ====================

type TaskStatus = '训练中' | '已完成' | '等待加入'
type PrivacyProtocol = '差分隐私' | '安全聚合'

interface FederatedTask {
  id: string
  name: string
  model: string
  participantCount: number
  currentRound: number
  totalRounds: number
  status: TaskStatus
  protocol: PrivacyProtocol
  createdAt: string
}

const tasks = ref<FederatedTask[]>([
  { id: 'f1', name: '跨院医疗影像联合训练', model: 'ResNet-50', participantCount: 3, currentRound: 15, totalRounds: 20, status: '训练中', protocol: '差分隐私', createdAt: '2026-03-18' },
  { id: 'f2', name: '金融反欺诈联合模型', model: 'XGBoost-FL', participantCount: 5, currentRound: 30, totalRounds: 30, status: '已完成', protocol: '安全聚合', createdAt: '2026-03-10' },
  { id: 'f3', name: '多方推荐系统优化', model: 'DeepFM', participantCount: 4, currentRound: 0, totalRounds: 25, status: '等待加入', protocol: '差分隐私', createdAt: '2026-03-20' },
  { id: 'f4', name: '智能客服知识联合', model: 'BERT-FL', participantCount: 2, currentRound: 8, totalRounds: 10, status: '训练中', protocol: '安全聚合', createdAt: '2026-03-15' },
])

const taskStatusConfig: Record<TaskStatus, { dotClass: string, badgeClass: string }> = {
  '训练中': { dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  '已完成': { dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  '等待加入': { dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
}

// ==================== Tab 2: 参与方管理 ====================

type ParticipantRole = '发起方' | '参与方'
type ConnectionStatus = '已连接' | '离线'

interface Participant {
  id: string
  orgName: string
  role: ParticipantRole
  datasetSize: string
  contribution: number
  status: ConnectionStatus
  joinedAt: string
}

const participants = ref<Participant[]>([
  { id: 'p1', orgName: '中心医院', role: '发起方', datasetSize: '120GB', contribution: 35, status: '已连接', joinedAt: '2026-02-15' },
  { id: 'p2', orgName: '省人民医院', role: '参与方', datasetSize: '85GB', contribution: 25, status: '已连接', joinedAt: '2026-02-20' },
  { id: 'p3', orgName: '第三附属医院', role: '参与方', datasetSize: '60GB', contribution: 18, status: '离线', joinedAt: '2026-03-01' },
  { id: 'p4', orgName: '金融数据中心', role: '发起方', datasetSize: '200GB', contribution: 40, status: '已连接', joinedAt: '2026-01-10' },
  { id: 'p5', orgName: '保险科技公司', role: '参与方', datasetSize: '90GB', contribution: 22, status: '已连接', joinedAt: '2026-02-05' },
  { id: 'p6', orgName: '银行风控部门', role: '参与方', datasetSize: '150GB', contribution: 30, status: '离线', joinedAt: '2026-02-28' },
])

// ==================== Tab 3: 隐私策略 ====================

interface PrivacyPolicy {
  id: string
  name: string
  description: string
  enabled: boolean
  /** 额外配置类型：input / select / none */
  configType: 'input' | 'select' | 'none'
  configLabel?: string
  configValue?: string
  configOptions?: string[]
}

const policies = ref<PrivacyPolicy[]>([
  { id: 'pp1', name: '差分隐私', description: '在模型参数中添加噪声，防止单个样本被逆向推断', enabled: true, configType: 'input', configLabel: 'Epsilon 参数', configValue: '1.0' },
  { id: 'pp2', name: '安全聚合', description: '使用密码学协议确保各方模型参数在聚合前不被明文暴露', enabled: true, configType: 'select', configLabel: '聚合方式', configValue: 'FedAvg', configOptions: ['FedAvg', 'FedSGD'] },
  { id: 'pp3', name: '数据脱敏', description: '对训练数据中的敏感字段进行匿名化处理', enabled: true, configType: 'none' },
  { id: 'pp4', name: '模型加密', description: '对传输和存储的模型参数进行加密保护', enabled: false, configType: 'select', configLabel: '加密算法', configValue: 'AES-256', configOptions: ['AES-256', 'SM4'] },
  { id: 'pp5', name: '审计追溯', description: '记录所有参与方的操作日志，支持事后审计与合规追查', enabled: true, configType: 'none' },
])

// ==================== 事件处理 ====================

/** 创建联邦任务 */
function handleCreateTask() {
  toast.success('联邦任务创建功能开发中')
}

/** 保存隐私策略 */
function handleSavePolicies() {
  toast.success('隐私策略已保存')
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-32" />
          <Skeleton class="h-4 w-80" />
        </div>
        <Skeleton class="h-9 w-32" />
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Skeleton v-for="i in 3" :key="i" class="h-[88px] rounded-xl" />
      </div>
      <Skeleton class="h-10 w-80" />
      <Skeleton class="h-[400px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- 页面头部 -->
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight">联邦学习</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            跨组织安全协作训练，数据不出域，模型共享收益
          </p>
        </div>
        <Button size="sm" @click="handleCreateTask">
          <Plus class="mr-2 size-4" />
          创建任务
        </Button>
      </div>

      <!-- 统计概览 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <!-- 联邦任务数 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Globe class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-muted-foreground/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-muted-foreground/20" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">联邦任务数</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.tasks }}
            </div>
          </div>
        </div>
        <!-- 参与方数量 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Users class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-chart-4/20 dark:text-chart-4/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-chart-4/30 via-chart-4/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">参与方数量</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.participants }}
            </div>
          </div>
        </div>
        <!-- 数据隔离率 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Shield class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-success/20 dark:text-success/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-success/40 dark:group-hover:text-success/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-success/30 via-success/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">数据隔离率</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.isolationRate }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 布局 -->
      <Tabs default-value="tasks" class="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks" class="gap-1.5">
            <Workflow class="size-4" />
            联邦任务
          </TabsTrigger>
          <TabsTrigger value="participants" class="gap-1.5">
            <Users class="size-4" />
            参与方管理
          </TabsTrigger>
          <TabsTrigger value="privacy" class="gap-1.5">
            <Lock class="size-4" />
            隐私策略
          </TabsTrigger>
        </TabsList>

        <!-- Tab 1: 联邦任务 -->
        <TabsContent value="tasks">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-3">
              <CardTitle class="text-[15px] font-semibold">联邦任务列表</CardTitle>
              <CardDescription class="text-[13px]">
                管理跨组织联邦学习训练任务，追踪聚合进度
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">任务名称</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">模型</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">参与方数</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">聚合轮次</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">状态</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">隐私协议</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider">创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="task in tasks" :key="task.id">
                    <TableCell class="font-medium text-sm">{{ task.name }}</TableCell>
                    <TableCell class="text-xs text-muted-foreground">{{ task.model }}</TableCell>
                    <TableCell class="text-sm tabular-nums">{{ task.participantCount }}</TableCell>
                    <TableCell class="text-xs tabular-nums font-mono">{{ task.currentRound }}/{{ task.totalRounds }}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        :class="cn('gap-1.5 border-0 text-[11px] font-medium', taskStatusConfig[task.status].badgeClass)"
                      >
                        <span :class="cn('size-1.5 rounded-full', taskStatusConfig[task.status].dotClass)" />
                        {{ task.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" class="text-[11px] font-medium border-0 bg-muted">
                        {{ task.protocol }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-xs text-muted-foreground tabular-nums">{{ task.createdAt }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Tab 2: 参与方管理 -->
        <TabsContent value="participants">
          <div class="grid gap-4 sm:grid-cols-2">
            <Card
              v-for="p in participants"
              :key="p.id"
              class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs"
            >
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-[15px] font-semibold">{{ p.orgName }}</CardTitle>
                  <div class="flex items-center gap-1.5">
                    <span
                      :class="cn(
                        'size-2 rounded-full',
                        p.status === '已连接' ? 'bg-success' : 'bg-destructive',
                      )"
                    />
                    <span class="text-xs text-muted-foreground">{{ p.status }}</span>
                  </div>
                </div>
                <CardDescription class="text-[13px]">
                  <Badge variant="secondary" class="text-[11px] font-medium border-0 bg-muted">
                    {{ p.role }}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-2 text-[13px]">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">数据集大小</span>
                    <span class="font-medium tabular-nums">{{ p.datasetSize }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">贡献度</span>
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          class="h-full rounded-full bg-primary transition-all"
                          :style="{ width: `${p.contribution}%` }"
                        />
                      </div>
                      <span class="font-medium tabular-nums">{{ p.contribution }}%</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">加入时间</span>
                    <span class="text-xs tabular-nums">{{ p.joinedAt }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Tab 3: 隐私策略 -->
        <TabsContent value="privacy">
          <div class="space-y-3">
            <div
              v-for="policy in policies"
              :key="policy.id"
              :class="cn(
                'border border-border/40 bg-card/80 rounded-xl p-5 transition-opacity',
                policy.enabled ? 'border-l-[3px] border-l-success' : 'opacity-60',
              )"
            >
              <!-- 头部：名称 + 开关 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    :class="cn(
                      'size-2 rounded-full shrink-0',
                      policy.enabled ? 'bg-success' : 'bg-muted-foreground',
                    )"
                  />
                  <h4 class="text-sm font-semibold">{{ policy.name }}</h4>
                </div>
                <Switch v-model:checked="policy.enabled" />
              </div>

              <!-- 描述 -->
              <p class="mt-2 pl-4 text-[13px] text-muted-foreground">
                {{ policy.description }}
              </p>

              <!-- 额外配置 -->
              <div v-if="policy.configType !== 'none' && policy.enabled" class="mt-3 pl-4">
                <Separator class="mb-3" />
                <div class="flex items-center gap-3">
                  <span class="text-[13px] text-muted-foreground whitespace-nowrap">{{ policy.configLabel }}</span>
                  <!-- Input 配置 -->
                  <Input
                    v-if="policy.configType === 'input'"
                    v-model="policy.configValue"
                    class="h-8 w-32 rounded-xl text-xs"
                  />
                  <!-- Select 配置 -->
                  <Select v-if="policy.configType === 'select'" v-model="policy.configValue">
                    <SelectTrigger class="w-36 h-8 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="opt in policy.configOptions"
                        :key="opt"
                        :value="opt"
                      >
                        {{ opt }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <!-- 保存按钮 -->
            <div class="pt-4">
              <Button size="sm" class="gap-1.5 rounded-xl" @click="handleSavePolicies">
                保存策略
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
