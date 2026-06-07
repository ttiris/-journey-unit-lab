import { motion } from 'framer-motion';

const TagFilter = ({ label, tags = [], selected = [], onChange, colorClass = 'candy-pink' }) => (
  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow">
    <p className="mb-3 text-sm uppercase tracking-[0.35em] text-white/70">{label}</p>
    <div className="flex flex-wrap gap-2">
      {tags.length === 0 && (
        <span className="text-xs text-white/40">No tags available</span>
      )}
      {tags.map((tag) => {
        const active = selected.includes(tag);
        const activeStyles = {
          'candy-pink': 'bg-candy-pink/20 border border-candy-pink text-candy-pink',
          'candy-purple': 'bg-candy-purple/20 border border-candy-purple text-candy-purple',
          'candy-blue': 'bg-candy-blue/20 border border-candy-blue text-candy-blue',
          'candy-mint': 'bg-candy-mint/20 border border-candy-mint text-candy-mint',
        };
        const activeClassName = activeStyles[colorClass] || activeStyles['candy-pink'];

        return (
          <motion.button
            key={tag}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(tag)}
            className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em] transition ${active ? activeClassName : 'border border-white/10 text-white/60 hover:border-white/30'}`}
          >
            {tag}
          </motion.button>
        );
      })}
    </div>
  </div>
);

export default TagFilter;
