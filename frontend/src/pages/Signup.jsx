import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';

const Signup = () => {
  const navigate = useNavigate();
  const { register, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!email || !username || !password || !confirmPassword) {
      setFormError('Please fill in every field.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await register(email, username, password);
      navigate('/upload');
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,172,209,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(96,189,255,0.16),_transparent_32%),#05050b] pt-32"
    >
      <div className="absolute left-10 top-10 h-60 w-60 rounded-full bg-candy-mint/20 blur-3xl" />
      <div className="absolute right-8 bottom-20 h-72 w-72 rounded-full bg-candy-purple/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <AuthCard
          title="Create your account"
          subtitle="Join the lab to turn your travel moments into active design assets."
          footer={
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-candy-blue hover:text-candy-blue/90">
                Log in
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
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="travel_maker"
                  className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-3xl bg-gradient-to-r from-candy-blue via-candy-purple to-candy-pink px-5 py-3 text-sm font-semibold text-dark-bg shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </AuthCard>
      </div>
    </motion.div>
  );
};

export default Signup;
