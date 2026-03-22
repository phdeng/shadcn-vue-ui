<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { cn } from '@ui/lib/utils'
import {
  Calendar,
  Cloud,
  Code,
  Database,
  Download,
  Globe,
  Mail,
  MoreHorizontal,
  Plug,
  Plus,
  Search,
  Star,
  Store,
  Trash2,
  Wrench,
} from 'lucide-vue-next'
/**
 * @description 工具与集成页 — 工具市场 / MCP 连接器 / 已安装工具
 * @author Timon
 */
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import PageLoading from '@/components/common/PageLoading.vue'

const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)

const activeTab = ref('store')

// ==================== Tab 1：工具市场 ====================

const storeSearch = ref('')

interface StoreTool {
  id: string
  name: string
  description: string
  icon: typeof Globe
  installed: boolean
  source: '官方' | '社区'
  stars: number
  downloads: string
}

const storeTools = ref<StoreTool[]>([
  { id: 's1', name: '天气查询', description: '查询全球城市实时天气与未来 7 天预报，支持多语言输出', icon: Cloud, installed: true, source: '官方', stars: 312, downloads: '8.7k' },
  { id: 's2', name: '网页搜索', description: '基于搜索引擎 API 检索互联网信息，返回结构化摘要', icon: Globe, installed: true, source: '官方', stars: 528, downloads: '15.2k' },
  { id: 's3', name: '代码执行', description: '安全沙箱中执行 Python / JavaScript 代码片段并返回结果', icon: Code, installed: false, source: '官方', stars: 256, downloads: '5.1k' },
  { id: 's4', name: '数据库查询', description: '连接 PostgreSQL / MySQL 数据库，支持自然语言转 SQL', icon: Database, installed: false, source: '社区', stars: 178, downloads: '3.9k' },
  { id: 's5', name: '邮件发送', description: '通过 SMTP 或 API 发送邮件通知，支持模板与附件', icon: Mail, installed: false, source: '社区', stars: 89, downloads: '1.2k' },
  { id: 's6', name: '日历管理', description: '对接 Google Calendar / Outlook 日历，创建与查询日程', icon: Calendar, installed: true, source: '官方', stars: 145, downloads: '4.3k' },
])

const filteredStoreTools = computed(() => {
  const q = storeSearch.value.trim().toLowerCase()
  if (!q) return storeTools.value
  return storeTools.value.filter(t =>
    t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
  )
})

/** 安装/卸载工具 */
function handleToggleInstall(tool: StoreTool) {
  tool.installed = !tool.installed
  toast.success(tool.installed ? '已安装' : '已卸载', { description: tool.name })
}

// ==================== Tab 2：MCP 连接器 ====================

type McpStatus = 'connected' | 'disconnected' | 'testing'

interface McpServer {
  id: string
  name: string
  endpoint: string
  protocol: string
  status: McpStatus
  toolCount: number
  lastHeartbeat: string
}

const mcpStatusConfig: Record<McpStatus, { label: string, dotClass: string, badgeVariant: 'secondary' | 'outline' | 'destructive' }> = {
  connected: { label: '已连接', dotClass: 'bg-success', badgeVariant: 'secondary' },
  disconnected: { label: '断开', dotClass: 'bg-destructive', badgeVariant: 'destructive' },
  testing: { label: '测试中', dotClass: 'bg-primary animate-pulse', badgeVariant: 'secondary' },
}

const mcpServers = ref<McpServer[]>([
  { id: 'm1', name: '本地文件系统', endpoint: 'localhost:3100', protocol: 'v1.0', status: 'connected', toolCount: 4, lastHeartbeat: '2 秒前' },
  { id: 'm2', name: 'GitHub API', endpoint: 'mcp.github.com', protocol: 'v1.0', status: 'connected', toolCount: 12, lastHeartbeat: '5 秒前' },
  { id: 'm3', name: '数据库查询', endpoint: 'localhost:3200', protocol: 'v1.0', status: 'connected', toolCount: 3, lastHeartbeat: '8 秒前' },
  { id: 'm4', name: 'Slack 集成', endpoint: 'mcp.slack.com', protocol: 'v1.0', status: 'disconnected', toolCount: 8, lastHeartbeat: '3 小时前' },
  { id: 'm5', name: '自定义工具', endpoint: 'localhost:3300', protocol: 'v1.0', status: 'testing', toolCount: 2, lastHeartbeat: '— ' },
])

/** 注册 MCP Server */
function handleRegisterMcp() {
  toast.info('注册 MCP Server', { description: '注册功能即将上线' })
}

/** 测试连接 */
function handleTestConnection(server: McpServer) {
  server.status = 'testing'
  toast.info('正在测试连接...', { description: server.endpoint })
  setTimeout(() => {
    server.status = 'connected'
    server.lastHeartbeat = '刚刚'
    toast.success('连接成功', { description: server.name })
  }, 2000)
}

/** 编辑 MCP Server */
function handleEditMcp(server: McpServer) {
  toast.info('编辑 MCP Server', { description: server.name })
}

/** 删除 MCP Server */
function handleDeleteMcp(server: McpServer) {
  mcpServers.value = mcpServers.value.filter(s => s.id !== server.id)
  toast.success('已删除', { description: server.name })
}

// ==================== Tab 3：已安装工具 ====================

type ToolSource = '内置' | 'MCP' | '自定义'
type ToolStatus = 'active' | 'disabled'

interface InstalledTool {
  id: string
  name: string
  source: ToolSource
  agentCount: number
  callCount: number
  status: ToolStatus
}

const sourceConfig: Record<ToolSource, { badgeVariant: 'secondary' | 'outline' | 'destructive' }> = {
  '内置': { badgeVariant: 'secondary' },
  'MCP': { badgeVariant: 'outline' },
  '自定义': { badgeVariant: 'outline' },
}

const installedTools = ref<InstalledTool[]>([
  { id: 'i1', name: '天气查询', source: '内置', agentCount: 3, callCount: 1280, status: 'active' },
  { id: 'i2', name: '网页搜索', source: '内置', agentCount: 5, callCount: 4520, status: 'active' },
  { id: 'i3', name: '日历管理', source: '内置', agentCount: 2, callCount: 890, status: 'active' },
  { id: 'i4', name: 'GitHub 文件读取', source: 'MCP', agentCount: 4, callCount: 2100, status: 'active' },
  { id: 'i5', name: 'GitHub PR 管理', source: 'MCP', agentCount: 2, callCount: 760, status: 'active' },
  { id: 'i6', name: 'SQL 查询', source: 'MCP', agentCount: 1, callCount: 340, status: 'active' },
  { id: 'i7', name: '自定义翻译', source: '自定义', agentCount: 1, callCount: 120, status: 'disabled' },
  { id: 'i8', name: '日志分析', source: '自定义', agentCount: 0, callCount: 45, status: 'disabled' },
])

/** 配置工具 */
function handleConfigureTool(tool: InstalledTool) {
  toast.info('配置工具', { description: tool.name })
}

/** 卸载工具 */
function handleUninstallTool(tool: InstalledTool) {
  installedTools.value = installedTools.value.filter(t => t.id !== tool.id)
  toast.success('已卸载', { description: tool.name })
}
</script>

<template>
  <div>
    <PageLoading v-if="loading" :count="6" :cols="3" />

    <div v-else class="flex flex-col gap-6">
      <!-- 页面标题 -->
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          工具与集成
        </h2>
        <p class="mt-1.5 text-[13px] text-muted-foreground">
          管理工具市场、MCP 连接器与已安装工具
        </p>
      </div>

      <!-- Tab 布局 -->
      <Tabs v-model="activeTab" class="w-full">
        <TabsList>
          <TabsTrigger value="store" class="gap-1.5">
            <Store class="size-3.5" />
            工具市场
          </TabsTrigger>
          <TabsTrigger value="mcp" class="gap-1.5">
            <Plug class="size-3.5" />
            MCP 连接器
          </TabsTrigger>
          <TabsTrigger value="installed" class="gap-1.5">
            <Wrench class="size-3.5" />
            已安装工具
          </TabsTrigger>
        </TabsList>

        <!-- ==================== Tab 1：工具市场 ==================== -->
        <TabsContent value="store" class="mt-6">
          <div class="flex flex-col gap-6">
            <!-- 搜索栏 -->
            <div class="flex items-center justify-between">
              <div class="relative w-72">
                <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input v-model="storeSearch" placeholder="搜索工具..." class="pl-8 h-9" />
              </div>
              <span class="text-sm text-muted-foreground">共 {{ filteredStoreTools.length }} 个工具</span>
            </div>

            <!-- 工具卡片网格 -->
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Card
                v-for="tool in filteredStoreTools"
                :key="tool.id"
                class="group border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/60"
              >
                <CardHeader class="pb-2">
                  <div class="flex items-start gap-3">
                    <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <component :is="tool.icon" class="size-5 text-foreground/70" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <CardTitle class="text-sm leading-none">
                          {{ tool.name }}
                        </CardTitle>
                        <Badge variant="outline" class="text-[10px] tracking-wide px-1.5 py-0">
                          {{ tool.source }}
                        </Badge>
                      </div>
                      <p class="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {{ tool.description }}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent class="pb-2">
                  <div class="flex items-center gap-3 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Star class="size-3" />
                      {{ tool.stars }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Download class="size-3" />
                      {{ tool.downloads }}
                    </span>
                  </div>
                </CardContent>

                <CardFooter class="flex-col items-stretch gap-3 pt-0">
                  <Separator />
                  <div class="flex items-center justify-between">
                    <Badge
                      :variant="tool.installed ? 'secondary' : 'outline'"
                      class="text-[10px] tracking-wide gap-1"
                    >
                      <span
                        :class="cn('size-1.5 rounded-full', tool.installed ? 'bg-success' : 'bg-muted-foreground/40')"
                      />
                      {{ tool.installed ? '已安装' : '未安装' }}
                    </Badge>
                    <Button
                      :variant="tool.installed ? 'outline' : 'default'"
                      size="sm"
                      class="h-7 text-xs px-3"
                      @click="handleToggleInstall(tool)"
                    >
                      {{ tool.installed ? '卸载' : '安装' }}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <!-- 空状态 -->
            <div
              v-if="filteredStoreTools.length === 0"
              class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16"
            >
              <Search class="size-10 text-muted-foreground/40" />
              <div class="text-center">
                <p class="text-sm font-medium text-muted-foreground">未找到匹配的工具</p>
                <p class="mt-1 text-xs text-muted-foreground/60">尝试调整搜索关键词</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- ==================== Tab 2：MCP 连接器 ==================== -->
        <TabsContent value="mcp" class="mt-6">
          <div class="flex flex-col gap-6">
            <!-- 操作栏 -->
            <div class="flex items-center justify-between">
              <p class="text-sm text-muted-foreground">共 {{ mcpServers.length }} 个 MCP Server</p>
              <Button size="sm" @click="handleRegisterMcp">
                <Plus class="mr-2 size-4" />
                注册 MCP Server
              </Button>
            </div>

            <!-- 连接器列表表格 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
              <CardContent class="p-0">
                <Table>
                  <TableHeader>
                    <TableRow class="border-border/50">
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Server 名称</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">端点 URL</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">协议版本</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">工具数</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">最后心跳</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground w-[60px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="server in mcpServers"
                      :key="server.id"
                      class="border-border/50 transition-colors duration-200 hover:bg-muted/30"
                    >
                      <TableCell class="font-medium text-sm">{{ server.name }}</TableCell>
                      <TableCell class="font-mono text-[13px] text-muted-foreground">{{ server.endpoint }}</TableCell>
                      <TableCell>
                        <Badge variant="outline" class="text-[10px] tracking-wide">{{ server.protocol }}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge :variant="mcpStatusConfig[server.status].badgeVariant" class="gap-1.5 text-[10px] tracking-wide">
                          <span :class="cn('size-1.5 rounded-full', mcpStatusConfig[server.status].dotClass)" />
                          {{ mcpStatusConfig[server.status].label }}
                        </Badge>
                      </TableCell>
                      <TableCell class="tabular-nums text-[13px] text-muted-foreground">{{ server.toolCount }}</TableCell>
                      <TableCell class="text-[13px] text-muted-foreground">{{ server.lastHeartbeat }}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <Button variant="ghost" size="icon" class="size-7">
                              <MoreHorizontal class="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem @click="handleTestConnection(server)">
                              测试连接
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="handleEditMcp(server)">
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem class="text-destructive" @click="handleDeleteMcp(server)">
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <!-- 空状态 -->
                <div
                  v-if="mcpServers.length === 0"
                  class="flex flex-col items-center justify-center gap-4 py-16"
                >
                  <Plug class="size-16 text-muted-foreground/15" />
                  <div class="text-center">
                    <p class="text-sm font-medium text-muted-foreground">暂无 MCP Server</p>
                    <p class="mt-1 text-[13px] text-muted-foreground/60">注册第一个 MCP Server 以扩展工具能力</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- ==================== Tab 3：已安装工具 ==================== -->
        <TabsContent value="installed" class="mt-6">
          <div class="flex flex-col gap-6">
            <p class="text-sm text-muted-foreground">共 {{ installedTools.length }} 个已安装工具</p>

            <!-- 已安装工具表格 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
              <CardContent class="p-0">
                <Table>
                  <TableHeader>
                    <TableRow class="border-border/50">
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">工具名称</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">来源</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">关联 Agent</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">调用次数</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground w-[60px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="tool in installedTools"
                      :key="tool.id"
                      class="border-border/50 transition-colors duration-200 hover:bg-muted/30"
                    >
                      <TableCell class="font-medium text-sm">{{ tool.name }}</TableCell>
                      <TableCell>
                        <Badge :variant="sourceConfig[tool.source].badgeVariant" class="text-[10px] tracking-wide">
                          {{ tool.source }}
                        </Badge>
                      </TableCell>
                      <TableCell class="tabular-nums text-[13px] text-muted-foreground">{{ tool.agentCount }}</TableCell>
                      <TableCell class="tabular-nums text-[13px] text-muted-foreground">{{ tool.callCount.toLocaleString() }}</TableCell>
                      <TableCell>
                        <Badge
                          :variant="tool.status === 'active' ? 'secondary' : 'outline'"
                          class="gap-1.5 text-[10px] tracking-wide"
                        >
                          <span
                            :class="cn('size-1.5 rounded-full', tool.status === 'active' ? 'bg-success' : 'bg-muted-foreground/40')"
                          />
                          {{ tool.status === 'active' ? '启用' : '停用' }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <Button variant="ghost" size="icon" class="size-7">
                              <MoreHorizontal class="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem @click="handleConfigureTool(tool)">
                              配置
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem class="text-destructive" @click="handleUninstallTool(tool)">
                              卸载
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <!-- 空状态 -->
                <div
                  v-if="installedTools.length === 0"
                  class="flex flex-col items-center justify-center gap-4 py-16"
                >
                  <Wrench class="size-16 text-muted-foreground/15" />
                  <div class="text-center">
                    <p class="text-sm font-medium text-muted-foreground">暂无已安装工具</p>
                    <p class="mt-1 text-[13px] text-muted-foreground/60">前往工具市场安装工具</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
