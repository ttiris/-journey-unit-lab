import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 mx-auto w-full px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-candy-pink via-candy-purple to-candy-blue shadow-neon-purple text-sm font-bold text-dark-bg">
            JU
          </div>
          <div>
            <NavLink to="/" className="text-lg font-semibold tracking-[0.12em] text-white transition hover:text-candy-pink">
              Journey Unit Lab
            </NavLink>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">旅行碎片 · 设计资产</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-white/80">
          <NavLink to="/" className={({ isActive }) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
            首页
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/upload" className={({ isActive }) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                上传
              </NavLink>
              <NavLink to="/assets" className={({ isActive }) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                资产库
              </NavLink>
              <NavLink to="/inspiration" className={({ isActive }) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                灵感
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="rounded-2xl bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 ring-1 ring-white/10">
                {user?.username || '设计师'}
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="rounded-full border border-candy-pink px-4 py-2 text-sm font-semibold text-candy-pink transition hover:bg-candy-pink/10"
              >
                退出
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-candy-blue hover:text-candy-blue">
                登录
              </NavLink>
              <NavLink to="/signup" className="rounded-full bg-candy-pink px-4 py-2 text-sm font-semibold text-dark-bg transition hover:bg-candy-pink/90">
                注册
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
