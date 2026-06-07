import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const colorStyles = {
  'candy-pink': 'bg-candy-pink/20 text-candy-pink shadow-neon-pink',
  'candy-purple': 'bg-candy-purple/20 text-candy-purple shadow-neon-purple',
  'candy-blue': 'bg-candy-blue/20 text-candy-blue shadow-neon-blue',
  'candy-mint': 'bg-candy-mint/20 text-candy-mint shadow-neon-mint',
};

const dotStyles = {
  'candy-pink': 'bg-candy-pink/40',
  'candy-purple': 'bg-candy-purple/40',
  'candy-blue': 'bg-candy-blue/40',
  'candy-mint': 'bg-candy-mint/40',
};

const WorkflowStep = ({ step, title, desc, color, delay }) => {
  const badgeClass = colorStyles[color] || colorStyles['candy-pink'];
  const dotClass = dotStyles[color] || dotStyles['candy-pink'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-glow backdrop-blur-xl transition hover:border-white/20"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold ${badgeClass}`}>
        {step}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{desc}</p>
      <div className={`absolute -right-2 -top-2 h-4 w-4 rounded-full blur-sm ${dotClass}`} />
    </motion.div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden pt-32 pb-16">
      <AnimatedBackground variant="default" />

      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl space-y-6"
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex rounded-full border border-candy-pink/20 bg-candy-pink/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-candy-pink neon-pulse"
            >
              Y2K × makemepulse vibe
            </motion.div>
            <h1 className="text-5xl font-black leading-[1.08] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
              Travel memories<br />
              <span className="text-gradient">become design assets.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/70">
              Journey Unit Lab transforms travel fragments into reusable creative assets with AI-powered decomposition, emotional tagging, and inspiration synthesis.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to={isAuthenticated ? '/upload' : '/signup'}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue px-6 py-3 text-sm font-semibold text-dark-bg shadow-neon-pink transition hover:scale-[1.02]"
              >
                Start creating →
              </Link>
              <Link
                to={isAuthenticated ? '/assets' : '/login'}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-candy-blue hover:text-candy-blue"
              >
                {isAuthenticated ? 'My Library' : 'Log in'}
              </Link>
            </div>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="retro-border relative w-full max-w-xl rounded-[48px] border border-white/10 bg-black/40 p-6 shadow-glow backdrop-blur-2xl"
          >
            <div className="absolute inset-0 rounded-[48px] bg-[conic-gradient(at_top,_rgba(255,255,255,0.06),_transparent_40%)] opacity-60" />
            <div className="relative space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-neon-blue">
                <p className="text-sm uppercase tracking-[0.35em] text-candy-yellow">Travel Pulse</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Capture emotional triggers, scenes, and motion.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-candy-pink/30 transition">
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-pink">Asset</p>
                  <p className="mt-4 text-sm text-white/70">Photo, notes, route, sound snippet.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-candy-blue/30 transition">
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-blue">AI</p>
                  <p className="mt-4 text-sm text-white/70">Decompose into 5 dimensions of design data.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-candy-mint/30 transition">
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-mint">Search</p>
                  <p className="mt-4 text-sm text-white/70">Find assets by mood, behavior, and vibe.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-candy-purple/30 transition">
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-purple">Inspire</p>
                  <p className="mt-4 text-sm text-white/70">Generate new schemes from your archive.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-candy-blue">How it works</p>
            <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">From travel moment to design asset</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <WorkflowStep step="01" title="Capture" desc="Upload photos, text notes, or route fragments from your journey." color="candy-pink" delay={0} />
            <WorkflowStep step="02" title="Decompose" desc="AI extracts triggers, emotions, behaviors, and understanding." color="candy-purple" delay={0.1} />
            <WorkflowStep step="03" title="Tag & Store" desc="Auto-generated multi-dimensional tags for precise searchability." color="candy-blue" delay={0.2} />
            <WorkflowStep step="04" title="Synthesize" desc="Combine assets into fresh design concepts with AI inspiration." color="candy-mint" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[40px] border border-white/10 bg-black/40 p-10 shadow-glow backdrop-blur-xl">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              {[
                { label: 'AI Dimensions', value: '5', suffix: 'D', color: 'candy-pink' },
                { label: 'Tag Categories', value: '4', suffix: '×', color: 'candy-purple' },
                { label: 'Search Vectors', value: '∞', suffix: '', color: 'candy-blue' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <p className={`text-5xl font-black ${colorStyles[stat.color] || 'text-candy-pink'}`}>
                    {stat.value}<span className="text-3xl">{stat.suffix}</span>
                  </p>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mt-24 pb-8">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white">Ready to transform your travels?</h2>
            <p className="mt-4 text-lg text-white/60">Upload your first experience fragment and watch AI turn it into a structured, searchable design asset.</p>
            <div className="mt-8">
              <Link
                to={isAuthenticated ? '/upload' : '/signup'}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue px-8 py-4 text-sm font-semibold text-dark-bg shadow-neon-pink transition hover:scale-[1.02]"
              >
                {isAuthenticated ? 'Upload an asset →' : 'Get started free →'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

