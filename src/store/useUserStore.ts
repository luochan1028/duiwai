import { create } from 'zustand';
import type { UserInfo } from '@/types';

/**
 * 用户管理 store
 * - 用户列表 CRUD（localStorage 持久化）
 * - 密码独立存储（不暴露到登录后的 user 对象）
 * - 默认账号：admin/admin（老师）、student/123456（学生）
 */

const USERS_STORAGE_KEY = 'jizu-users-db';

/** 数据库中的用户记录（含密码） */
interface UserRecord extends UserInfo {
  password: string;
}

/** 默认初始用户 */
const DEFAULT_USERS: UserRecord[] = [
  {
    id: 'admin',
    username: 'admin',
    password: 'admin',
    role: 'teacher',
    name: '管理员',
    avatar: '管',
    createdAt: Date.now(),
  },
  {
    id: 'student',
    username: 'student',
    password: '123456',
    role: 'student',
    name: '张同学',
    studentId: '2025001',
    className: '网安2025-1班',
    email: 'student@example.com',
    avatar: '张',
    createdAt: Date.now(),
  },
  {
    id: 'student2',
    username: 'liwei',
    password: '123456',
    role: 'student',
    name: '李伟',
    studentId: '2025002',
    className: '网安2025-1班',
    email: 'liwei@example.com',
    avatar: '李',
    createdAt: Date.now(),
  },
  {
    id: 'student3',
    username: 'wangfang',
    password: '123456',
    role: 'student',
    name: '王芳',
    studentId: '2025003',
    className: '网安2025-2班',
    email: 'wangfang@example.com',
    avatar: '王',
    createdAt: Date.now(),
  },
];

function loadUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // 首次初始化默认用户
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return DEFAULT_USERS;
  }
}

function saveUsers(users: UserRecord[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

/** 去除密码字段，返回安全的 UserInfo */
function toSafeUser(record: UserRecord): UserInfo {
  const { password, ...safe } = record;
  return safe;
}

interface UserManageState {
  /** 全部用户记录（含密码，仅管理员可见） */
  users: UserRecord[];
  /** 校验登录，返回安全用户或错误信息 */
  authenticate: (username: string, password: string) => { success: boolean; message?: string; user?: UserInfo };
  /** 获取所有用户（安全，不含密码） */
  listUsers: () => UserInfo[];
  /** 新增用户 */
  addUser: (data: Omit<UserRecord, 'id' | 'createdAt'> & { id?: string }) => { success: boolean; message?: string };
  /** 更新用户信息（不含密码） */
  updateUser: (id: string, data: Partial<Omit<UserRecord, 'id' | 'password'>>) => { success: boolean; message?: string };
  /** 修改密码 */
  changePassword: (id: string, oldPwd: string, newPwd: string) => { success: boolean; message?: string };
  /** 管理员重置密码 */
  resetPassword: (id: string, newPwd: string) => { success: boolean; message?: string };
  /** 删除用户 */
  deleteUser: (id: string) => { success: boolean; message?: string };
  /** 根据 id 获取安全用户信息 */
  getUserById: (id: string) => UserInfo | undefined;
  /** 获取当前登录用户的最新信息（用于个人中心刷新） */
  refreshUser: (id: string) => UserInfo | null;
}

export const useUserStore = create<UserManageState>((set, get) => ({
  users: loadUsers(),

  authenticate: (username, password) => {
    const users = get().users;
    const record = users.find(u => u.username === username.trim());
    if (!record) {
      return { success: false, message: '用户名不存在' };
    }
    if (record.password !== password) {
      return { success: false, message: '密码错误' };
    }
    return { success: true, user: toSafeUser(record) };
  },

  listUsers: () => {
    return get().users.map(toSafeUser);
  },

  addUser: (data) => {
    const users = get().users;
    // 用户名唯一性校验
    if (users.some(u => u.username === data.username.trim())) {
      return { success: false, message: '用户名已存在' };
    }
    const id = data.id || `u-${Date.now()}`;
    const record: UserRecord = {
      id,
      username: data.username.trim(),
      password: data.password,
      role: data.role,
      name: data.name || data.username,
      avatar: data.avatar || (data.name || data.username).charAt(0),
      studentId: data.studentId,
      className: data.className,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      createdAt: Date.now(),
    };
    const next = [...users, record];
    saveUsers(next);
    set({ users: next });
    return { success: true };
  },

  updateUser: (id, data) => {
    const users = get().users;
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      return { success: false, message: '用户不存在' };
    }
    // 用户名修改时校验唯一性
    if (data.username && users.some(u => u.id !== id && u.username === data.username!.trim())) {
      return { success: false, message: '用户名已被占用' };
    }
    const updated = { ...users[idx], ...data };
    if (data.username) updated.username = data.username.trim();
    if (data.name) updated.avatar = data.avatar || data.name.charAt(0);
    const next = [...users];
    next[idx] = updated;
    saveUsers(next);
    set({ users: next });
    return { success: true };
  },

  changePassword: (id, oldPwd, newPwd) => {
    const users = get().users;
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      return { success: false, message: '用户不存在' };
    }
    if (users[idx].password !== oldPwd) {
      return { success: false, message: '原密码错误' };
    }
    if (!newPwd || newPwd.length < 4) {
      return { success: false, message: '新密码至少 4 位' };
    }
    const next = [...users];
    next[idx] = { ...next[idx], password: newPwd };
    saveUsers(next);
    set({ users: next });
    return { success: true };
  },

  resetPassword: (id, newPwd) => {
    const users = get().users;
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      return { success: false, message: '用户不存在' };
    }
    if (!newPwd || newPwd.length < 4) {
      return { success: false, message: '新密码至少 4 位' };
    }
    const next = [...users];
    next[idx] = { ...next[idx], password: newPwd };
    saveUsers(next);
    set({ users: next });
    return { success: true };
  },

  deleteUser: (id) => {
    const users = get().users;
    const target = users.find(u => u.id === id);
    if (!target) {
      return { success: false, message: '用户不存在' };
    }
    // 不允许删除最后一个管理员
    if (target.role === 'teacher' && users.filter(u => u.role === 'teacher').length <= 1) {
      return { success: false, message: '不能删除最后一个管理员账号' };
    }
    const next = users.filter(u => u.id !== id);
    saveUsers(next);
    set({ users: next });
    return { success: true };
  },

  getUserById: (id) => {
    const record = get().users.find(u => u.id === id);
    return record ? toSafeUser(record) : undefined;
  },

  refreshUser: (id) => {
    const record = get().users.find(u => u.id === id);
    return record ? toSafeUser(record) : null;
  },
}));
