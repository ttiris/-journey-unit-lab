import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/upload');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('请输入邮箱和密码。');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate('/upload');
    } catch (err) {
      setFormError(err.message || '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(0,153,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,70,193,0.2),_transparent_30%),#05050b] pt-32"
    >
      <div className="absolute left-0 top-12 h-56 w-56 rounded-full bg-candy-pink/15 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-candy-blue/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <AuthCard
          title="欢迎回来"
          subtitle="登录以继续构建你的旅行灵感设计库。"
          footer={
            <p>
              还没有账号？{' '}
              <Link to="/signup" className="text-candy-pink hover:text-candy-pink/90">
                注册
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{formError}</div>}
            {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
            <div className="space-y-3">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                密码
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-3xl bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue px-5 py-3 text-sm font-semibold text-dark-bg shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? '登录中…' : '登录'}
            </button>
          </form>
        </AuthCard>
      </div>
    </motion.div>
  );
};

export default Login;
