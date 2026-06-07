import { motion } from 'framer-motion';

const AuthCard = ({ title, subtitle, children, footer }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="glass mx-auto w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 px-8 py-10 shadow-glow"
  >
    <div className="space-y-3 text-center">
      <div className="inline-flex rounded-full bg-candy-pink/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-candy-pink">
        design login
      </div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-sm text-white/70">{subtitle}</p>
    </div>

    <div className="mt-8 space-y-6">{children}</div>

    {footer && <div className="mt-8 text-center text-xs text-white/50">{footer}</div>}
  </motion.div>
);

export default AuthCard;
