/**
 * 业务管理后台 Mock 数据模块
 *
 * 提供用户管理、订单管理等模拟数据，
 * 用于开发阶段的前端独立调试与页面渲染验证。
 *
 * @author Timon
 * @module shadcn-vue-ui-business/mocks
 */

// ─── 类型定义 ────────────────────────────────────────────

/** 用户状态枚举 */
export type UserStatus = 'active' | 'disabled'

/** 用户条目 */
export interface UserItem {
  /** 唯一标识 */
  id: number
  /** 用户姓名 */
  name: string
  /** 邮箱地址 */
  email: string
  /** 头像文字（姓氏首字） */
  avatar: string
  /** 角色 */
  role: '管理员' | '编辑' | '审核' | '普通用户'
  /** 所属部门 */
  department: string
  /** 账户状态 */
  status: UserStatus
  /** 手机号 */
  phone: string
  /** 注册时间 */
  createdAt: string
}

/** 订单状态枚举 */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

/** 订单条目 */
export interface OrderItem {
  /** 订单编号 */
  id: string
  /** 客户名称 */
  customer: string
  /** 商品名称 */
  product: string
  /** 订单金额（元） */
  amount: number
  /** 订单状态 */
  status: OrderStatus
  /** 创建时间 */
  createdAt: string
}

// ─── Mock 用户列表 ──────────────────────────────────────

/** 模拟用户数据，包含 8 位中文用户 */
export const mockUsers: UserItem[] = [
  { id: 1, name: '张明远', email: 'zhangmy@example.com', avatar: '张', role: '管理员', department: '技术部', status: 'active', phone: '138-0001-1001', createdAt: '2025-03-12' },
  { id: 2, name: '李思琪', email: 'lisq@example.com', avatar: '李', role: '编辑', department: '产品部', status: 'active', phone: '139-0002-2002', createdAt: '2025-05-08' },
  { id: 3, name: '王浩然', email: 'wanghr@example.com', avatar: '王', role: '审核', department: '运营部', status: 'active', phone: '136-0003-3003', createdAt: '2025-06-21' },
  { id: 4, name: '赵雪婷', email: 'zhaoxt@example.com', avatar: '赵', role: '普通用户', department: '市场部', status: 'disabled', phone: '137-0004-4004', createdAt: '2025-07-14' },
  { id: 5, name: '陈嘉伟', email: 'chenjw@example.com', avatar: '陈', role: '编辑', department: '技术部', status: 'active', phone: '135-0005-5005', createdAt: '2025-08-03' },
  { id: 6, name: '刘晓峰', email: 'liuxf@example.com', avatar: '刘', role: '管理员', department: '产品部', status: 'active', phone: '158-0006-6006', createdAt: '2025-09-19' },
  { id: 7, name: '周美玲', email: 'zhouml@example.com', avatar: '周', role: '审核', department: '运营部', status: 'disabled', phone: '159-0007-7007', createdAt: '2025-10-27' },
  { id: 8, name: '吴俊杰', email: 'wujj@example.com', avatar: '吴', role: '普通用户', department: '市场部', status: 'active', phone: '186-0008-8008', createdAt: '2026-01-05' },
]

// ─── Mock 订单列表 ──────────────────────────────────────

/** 模拟订单数据，包含 8 条订单记录 */
export const mockOrders: OrderItem[] = [
  { id: 'ORD-2026-0001', customer: '张明远', product: '企业版年度订阅', amount: 29_800, status: 'completed', createdAt: '2026-01-15 10:30:00' },
  { id: 'ORD-2026-0002', customer: '李思琪', product: '专业版季度订阅', amount: 4_500, status: 'completed', createdAt: '2026-01-22 14:20:00' },
  { id: 'ORD-2026-0003', customer: '王浩然', product: 'API 调用包 - 100万次', amount: 8_900, status: 'processing', createdAt: '2026-02-03 09:15:00' },
  { id: 'ORD-2026-0004', customer: '赵雪婷', product: '基础版月度订阅', amount: 299, status: 'cancelled', createdAt: '2026-02-10 16:45:00' },
  { id: 'ORD-2026-0005', customer: '陈嘉伟', product: '企业版年度订阅', amount: 29_800, status: 'completed', createdAt: '2026-02-18 11:00:00' },
  { id: 'ORD-2026-0006', customer: '刘晓峰', product: '数据存储扩容包 - 1TB', amount: 3_600, status: 'pending', createdAt: '2026-03-01 08:30:00' },
  { id: 'ORD-2026-0007', customer: '周美玲', product: '专业版年度订阅', amount: 15_800, status: 'processing', createdAt: '2026-03-08 13:50:00' },
  { id: 'ORD-2026-0008', customer: '吴俊杰', product: 'API 调用包 - 50万次', amount: 4_800, status: 'pending', createdAt: '2026-03-15 10:10:00' },
]

// ─── 辅助函数 ────────────────────────────────────────────

/**
 * 根据 ID 查找用户
 *
 * @param id - 用户唯一标识
 * @returns 匹配的用户对象，未找到时返回 undefined
 */
export function getUserById(id: number): UserItem | undefined {
  return mockUsers.find(user => user.id === id)
}

/**
 * 根据 ID 查找订单
 *
 * @param id - 订单编号
 * @returns 匹配的订单对象，未找到时返回 undefined
 */
export function getOrderById(id: string): OrderItem | undefined {
  return mockOrders.find(order => order.id === id)
}
