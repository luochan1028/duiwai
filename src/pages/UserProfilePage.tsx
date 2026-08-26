import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, IdCard, GraduationCap, BookOpen, Save, Lock,
  Check, AlertCircle, Calendar, ShieldCheck, Edit3,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useUserStore } from '@/store/useUserStore';
import type { UserInfo } from '@/types';

type Tab = 'info' | 'password';

export default function UserProfilePage() {
  const user = useStore((s) => s.user);
  const refreshCurrentUser = useStore((s) => s.refreshCurrentUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const changePassword = useUserStore((s) => s.changePassword);

  const [tab, setTab] = useState<Tab>('info');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserInfo>>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // 密码修改表单
  const [pwdForm, setPwdForm] = useState({ oldPwd: '', newPwd: '', confirmPwd: '' });
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 同步 user 到 form
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        studentId: user.studentId || '',
        className: user.className || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (!user) return null;

  const isTeacher = user.role === 'teacher';

  const handleSave = () => {
    setError('');
    setSaved(false);

    // 邮箱格式校验
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('邮箱格式不正确');
      return;
    }
    // 手机号格式校验
    if (form.phone && !/^1\d{10}$/.test(form.phone)) {
      setError('手机号格式不正确（11位数字）');
      return;
    }

    const result = updateUser(user.id, form);
    if (result.success) {
      refreshCurrentUser();
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.message || '保存失败');
    }
  };

  const handleChangePassword = () => {
    setPwdMsg(null);
    if (!pwdForm.oldPwd || !pwdForm.newPwd || !pwdForm.confirmPwd) {
      setPwdMsg({ type: 'error', text: '请填写完整' });
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      setPwdMsg({ type: 'error', text: '两次新密码不一致' });
      return;
    }
    if (pwdForm.newPwd.length < 4) {
      setPwdMsg({ type: 'error', text: '新密码至少 4 位' });
      return;
    }
    const result = changePassword(user.id, pwdForm.oldPwd, pwdForm.newPwd);
    if (result.success) {
      setPwdMsg({ type: 'success', text: '密码修改成功' });
      setPwdForm({ oldPwd: '', newPwd: '', confirmPwd: '' });
    } else {
      setPwdMsg({ type: 'error', text: result.message || '修改失败' });
    }
  };

  const fieldConfig = [
    { key: 'name' as const, label: '姓名', icon: User, placeholder: '请输入姓名', disabled: false },
    { key: 'studentId' as const, label: '学号', icon: IdCard, placeholder: '请输入学号', disabled: isTeacher },
    { key: 'className' as const, label: '班级', icon: GraduationCap, placeholder: '请输入班级', disabled: isTeacher },
    { key: 'email' as const, label: '邮箱', icon: Mail, placeholder: 'example@mail.com', disabled: false },
    { key: 'phone' as const, label: '手机号', icon: Phone, placeholder: '请输入手机号', disabled: false },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* 页头 */}
      <div className="mb-6">
        <h1 className="text-2xl font-tech font-bold glow-text mb-1">个人中心</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">维护你的基础信息与账号安全</p>
      </div>

      {/* 用户卡片概览 */}
      <div className="glass-card p-5 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg ${
            isTeacher
              ? 'bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-accent-pink)]'
              : 'bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]'
          }`}>
            {user.avatar || user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{user.name || user.username}</h2>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                isTeacher
                  ? 'bg-[var(--color-accent-secondary)]/15 text-[var(--color-accent-secondary)]'
                  : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'
              }`}>
                {isTeacher ? <ShieldCheck className="w-3 h-3 inline mr-1" /> : <GraduationCap className="w-3 h-3 inline mr-1" />}
                {isTeacher ? '管理员' : '学生'}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">@{user.username}</p>
            {user.email && (
              <p className="text-xs text-[var(--color-text-secondary)]/70 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3 h-3" /> {user.email}
              </p>
            )}
            {user.createdAt && (
              <p className="text-xs text-[var(--color-text-secondary)]/60 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Calendar className="w-3 h-3" /> 注册时间：{new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-5 border-b border-[var(--color-border)]">
        <button
          onClick={() => setTab('info')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            tab === 'info'
              ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <User className="w-4 h-4" /> 基础信息
        </button>
        <button
          onClick={() => setTab('password')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            tab === 'password'
              ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Lock className="w-4 h-4" /> 修改密码
        </button>
      </div>

      {/* 基础信息 Tab */}
      {tab === 'info' && (
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">基础信息</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 rounded-lg transition-all"
              >
                <Edit3 className="w-4 h-4" /> 编辑
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(false); setError(''); }}
                  className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--color-accent-primary)] text-white rounded-lg hover:opacity-90 transition-all"
                >
                  <Save className="w-4 h-4" /> 保存
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-[var(--color-accent-pink)]/10 border border-[var(--color-accent-pink)]/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-[var(--color-accent-pink)] flex-shrink-0" />
              <p className="text-xs text-[var(--color-accent-pink)]">{error}</p>
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/30 rounded-lg">
              <Check className="w-4 h-4 text-[var(--color-accent-green)] flex-shrink-0" />
              <p className="text-xs text-[var(--color-accent-green)]">保存成功</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldConfig.map(({ key, label, icon: Icon, placeholder, disabled }) => (
              <div key={key}>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    value={(form[key] as string) || ''}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    disabled={!editing || disabled}
                    className={`w-full h-11 pl-10 pr-4 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm transition-all ${
                      editing && !disabled
                        ? 'text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)]/60'
                        : 'text-[var(--color-text-primary)]/80 cursor-not-allowed'
                    }`}
                  />
                </div>
                {disabled && editing && (
                  <p className="text-[10px] text-[var(--color-text-secondary)]/60 mt-1">该字段仅管理员可修改</p>
                )}
              </div>
            ))}
          </div>

          {/* 个人简介 */}
          <div className="mt-4">
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">个人简介</label>
            <textarea
              value={form.bio || ''}
              onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="介绍一下自己..."
              disabled={!editing}
              rows={3}
              className={`w-full px-4 py-3 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm transition-all resize-none ${
                editing
                  ? 'text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)]/60'
                  : 'text-[var(--color-text-primary)]/80 cursor-not-allowed'
              }`}
            />
          </div>
        </div>
      )}

      {/* 修改密码 Tab */}
      {tab === 'password' && (
        <div className="glass-card p-5 md:p-6 max-w-md">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">修改密码</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mb-5">为了保证账号安全，请定期更换密码</p>

          {pwdMsg && (
            <div className={`flex items-center gap-2 px-3 py-2 mb-4 rounded-lg border ${
              pwdMsg.type === 'success'
                ? 'bg-[var(--color-accent-green)]/10 border-[var(--color-accent-green)]/30'
                : 'bg-[var(--color-accent-pink)]/10 border-[var(--color-accent-pink)]/30'
            }`}>
              {pwdMsg.type === 'success'
                ? <Check className="w-4 h-4 text-[var(--color-accent-green)] flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 text-[var(--color-accent-pink)] flex-shrink-0" />}
              <p className={`text-xs ${pwdMsg.type === 'success' ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-pink)]'}`}>
                {pwdMsg.text}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">原密码</label>
              <input
                type="password"
                value={pwdForm.oldPwd}
                onChange={(e) => setPwdForm(f => ({ ...f, oldPwd: e.target.value }))}
                placeholder="请输入原密码"
                className="w-full h-11 px-4 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/60"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">新密码</label>
              <input
                type="password"
                value={pwdForm.newPwd}
                onChange={(e) => setPwdForm(f => ({ ...f, newPwd: e.target.value }))}
                placeholder="至少 4 位"
                className="w-full h-11 px-4 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/60"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">确认新密码</label>
              <input
                type="password"
                value={pwdForm.confirmPwd}
                onChange={(e) => setPwdForm(f => ({ ...f, confirmPwd: e.target.value }))}
                placeholder="再次输入新密码"
                className="w-full h-11 px-4 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/60"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="w-full h-11 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> 确认修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
