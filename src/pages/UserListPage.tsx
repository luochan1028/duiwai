import { useState, useMemo } from 'react';
import {
  Users, Search, Plus, Edit3, Trash2, KeyRound, X, AlertCircle,
  Check, ShieldCheck, GraduationCap, Mail, Phone, IdCard,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useStore } from '@/store/useStore';
import type { UserInfo } from '@/types';

type ModalType = 'add' | 'edit' | 'resetPwd' | 'delete' | null;

interface ModalState {
  type: ModalType;
  userId?: string;
}

const emptyForm = {
  username: '',
  name: '',
  password: '',
  role: 'student' as UserInfo['role'],
  studentId: '',
  className: '',
  email: '',
  phone: '',
  bio: '',
};

export default function UserListPage() {
  const currentUser = useStore((s) => s.user);
  const listUsers = useUserStore((s) => s.listUsers);
  const addUser = useUserStore((s) => s.addUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const deleteUser = useUserStore((s) => s.deleteUser);
  const resetPassword = useUserStore((s) => s.resetPassword);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserInfo['role']>('all');
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetPwdValue, setResetPwdValue] = useState('');

  const users = useMemo(() => listUsers(), [listUsers, modal.type]);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.studentId || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const closeModal = () => {
    setModal({ type: null });
    setError('');
    setSuccess('');
    setForm({ ...emptyForm });
    setResetPwdValue('');
  };

  const openAdd = () => {
    setForm({ ...emptyForm });
    setError('');
    setModal({ type: 'add' });
  };

  const openEdit = (user: UserInfo) => {
    setForm({
      username: user.username,
      name: user.name || '',
      password: '',
      role: user.role,
      studentId: user.studentId || '',
      className: user.className || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
    });
    setError('');
    setModal({ type: 'edit', userId: user.id });
  };

  const openResetPwd = (userId: string) => {
    setResetPwdValue('');
    setError('');
    setModal({ type: 'resetPwd', userId });
  };

  const openDelete = (userId: string) => {
    setError('');
    setModal({ type: 'delete', userId });
  };

  const handleAdd = () => {
    setError('');
    if (!form.username.trim() || !form.password) {
      setError('用户名和密码为必填');
      return;
    }
    const result = addUser({
      username: form.username,
      password: form.password,
      role: form.role,
      name: form.name,
      studentId: form.studentId,
      className: form.className,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
    });
    if (result.success) {
      setSuccess('用户创建成功');
      setTimeout(closeModal, 1200);
    } else {
      setError(result.message || '创建失败');
    }
  };

  const handleEdit = () => {
    if (!modal.userId) return;
    setError('');
    const result = updateUser(modal.userId, {
      username: form.username,
      name: form.name,
      role: form.role,
      studentId: form.studentId,
      className: form.className,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
    });
    if (result.success) {
      setSuccess('用户信息更新成功');
      setTimeout(closeModal, 1200);
    } else {
      setError(result.message || '更新失败');
    }
  };

  const handleResetPwd = () => {
    if (!modal.userId) return;
    setError('');
    if (!resetPwdValue || resetPwdValue.length < 4) {
      setError('新密码至少 4 位');
      return;
    }
    const result = resetPassword(modal.userId, resetPwdValue);
    if (result.success) {
      setSuccess('密码重置成功');
      setTimeout(closeModal, 1200);
    } else {
      setError(result.message || '重置失败');
    }
  };

  const handleDelete = () => {
    if (!modal.userId) return;
    setError('');
    const result = deleteUser(modal.userId);
    if (result.success) {
      setSuccess('用户已删除');
      setTimeout(closeModal, 1200);
    } else {
      setError(result.message || '删除失败');
    }
  };

  const stats = useMemo(() => ({
    total: users.length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
  }), [users]);

  return (
    <div className="p-4 md:p-6">
      {/* 页头 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-tech font-bold glow-text mb-1">用户管理</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">维护所有用户信息</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white rounded-lg hover:opacity-90 transition-all text-sm shadow-lg"
        >
          <Plus className="w-4 h-4" /> 新增用户
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[var(--color-accent-primary)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">总用户</span>
          </div>
          <p className="text-2xl font-tech font-bold text-[var(--color-text-primary)]">{stats.total}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent-secondary)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">管理员</span>
          </div>
          <p className="text-2xl font-tech font-bold text-[var(--color-text-primary)]">{stats.teachers}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-[var(--color-accent-green)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">学生</span>
          </div>
          <p className="text-2xl font-tech font-bold text-[var(--color-text-primary)]">{stats.students}</p>
        </div>
      </div>

      {/* 搜索与筛选 */}
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索用户名、姓名、学号、邮箱..."
              className="w-full h-10 pl-10 pr-4 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | UserInfo['role'])}
            className="h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
          >
            <option value="all">全部角色</option>
            <option value="student">学生</option>
            <option value="teacher">管理员</option>
          </select>
        </div>
      </div>

      {/* 用户列表表格 */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left">
                <th className="px-4 py-3 font-medium text-[var(--color-text-secondary)]">用户</th>
                <th className="px-4 py-3 font-medium text-[var(--color-text-secondary)]">角色</th>
                <th className="px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell">学号</th>
                <th className="px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden lg:table-cell">班级</th>
                <th className="px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden lg:table-cell">联系方式</th>
                <th className="px-4 py-3 font-medium text-[var(--color-text-secondary)] text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    暂无匹配用户
                  </td>
                </tr>
              ) : (
                filtered.map(u => {
                  const isTeacher = u.role === 'teacher';
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-accent-primary)]/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                            isTeacher
                              ? 'bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-accent-pink)]'
                              : 'bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]'
                          }`}>
                            {u.avatar || u.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-text-primary)] truncate flex items-center gap-1.5">
                              {u.name || u.username}
                              {isSelf && <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] rounded">我</span>}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)]">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          isTeacher
                            ? 'bg-[var(--color-accent-secondary)]/15 text-[var(--color-accent-secondary)]'
                            : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'
                        }`}>
                          {isTeacher ? <ShieldCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                          {isTeacher ? '管理员' : '学生'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[var(--color-text-primary)]/80 flex items-center gap-1">
                          <IdCard className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                          {u.studentId || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-[var(--color-text-primary)]/80">
                        {u.className || '-'}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="space-y-0.5">
                          {u.email && (
                            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {u.email}
                            </p>
                          )}
                          {u.phone && (
                            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {u.phone}
                            </p>
                          )}
                          {!u.email && !u.phone && <span className="text-[var(--color-text-secondary)]/50">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            title="编辑"
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 rounded-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openResetPwd(u.id)}
                            title="重置密码"
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)]/10 rounded-lg transition-all"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDelete(u.id)}
                            title="删除"
                            disabled={isSelf}
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-pink)] hover:bg-[var(--color-accent-pink)]/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 弹窗 */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={closeModal}>
          <div
            className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头 */}
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-bg-secondary)] z-10">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                {modal.type === 'add' && '新增用户'}
                {modal.type === 'edit' && '编辑用户'}
                {modal.type === 'resetPwd' && '重置密码'}
                {modal.type === 'delete' && '删除用户'}
              </h3>
              <button onClick={closeModal} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-5">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-[var(--color-accent-pink)]/10 border border-[var(--color-accent-pink)]/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-[var(--color-accent-pink)] flex-shrink-0" />
                  <p className="text-xs text-[var(--color-accent-pink)]">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/30 rounded-lg">
                  <Check className="w-4 h-4 text-[var(--color-accent-green)] flex-shrink-0" />
                  <p className="text-xs text-[var(--color-accent-green)]">{success}</p>
                </div>
              )}

              {/* 新增/编辑 表单 */}
              {(modal.type === 'add' || modal.type === 'edit') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">用户名 *</label>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                        disabled={modal.type === 'edit'}
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">姓名</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
                      />
                    </div>
                  </div>

                  {modal.type === 'add' && (
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">密码 *</label>
                      <input
                        type="text"
                        value={form.password}
                        onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="初始密码"
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-[var(--color-text-secondary)] mb-1">角色</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: 'student' }))}
                        className={`flex-1 h-10 rounded-lg text-sm border transition-all flex items-center justify-center gap-1.5 ${
                          form.role === 'student'
                            ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" /> 学生
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: 'teacher' }))}
                        className={`flex-1 h-10 rounded-lg text-sm border transition-all flex items-center justify-center gap-1.5 ${
                          form.role === 'teacher'
                            ? 'border-[var(--color-accent-secondary)] bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" /> 管理员
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">学号</label>
                      <input
                        type="text"
                        value={form.studentId}
                        onChange={(e) => setForm(f => ({ ...f, studentId: e.target.value }))}
                        disabled={form.role === 'teacher'}
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">班级</label>
                      <input
                        type="text"
                        value={form.className}
                        onChange={(e) => setForm(f => ({ ...f, className: e.target.value }))}
                        disabled={form.role === 'teacher'}
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">邮箱</label>
                      <input
                        type="text"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-secondary)] mb-1">手机号</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={closeModal} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                      取消
                    </button>
                    <button
                      onClick={modal.type === 'add' ? handleAdd : handleEdit}
                      className="px-4 py-2 text-sm bg-[var(--color-accent-primary)] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      {modal.type === 'add' ? '创建' : '保存'}
                    </button>
                  </div>
                </div>
              )}

              {/* 重置密码 */}
              {modal.type === 'resetPwd' && (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-secondary)]">为该用户设置新密码，原密码将被覆盖。</p>
                  <div>
                    <label className="block text-xs text-[var(--color-text-secondary)] mb-1">新密码</label>
                    <input
                      type="text"
                      value={resetPwdValue}
                      onChange={(e) => setResetPwdValue(e.target.value)}
                      placeholder="至少 4 位"
                      className="w-full h-10 px-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={closeModal} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                      取消
                    </button>
                    <button
                      onClick={handleResetPwd}
                      className="px-4 py-2 text-sm bg-[var(--color-accent-secondary)] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      确认重置
                    </button>
                  </div>
                </div>
              )}

              {/* 删除确认 */}
              {modal.type === 'delete' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-accent-pink)]/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0" />
                    <p className="text-sm text-[var(--color-text-primary)]">确定要删除该用户吗？此操作不可撤销。</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={closeModal} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                      取消
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm bg-[var(--color-accent-pink)] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
