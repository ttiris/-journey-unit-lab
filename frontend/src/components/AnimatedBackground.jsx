import { motion } from 'framer-motion';

const AnimatedBackground = ({ variant = 'default' }) => {
  const variants = {
    default: {
      gradient: 'bg-[radial-gradient(circle_at_top_left,_rgba(255,113,180,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(45,125,255,0.10),_transparent_25%),#070707]',
      blob1: 'bg-candy-pink/15',
      blob2: 'bg-candy-blue/12',
      blob3: 'bg-candy-purple/10',
    },
    purple: {
      gradient: 'bg-[radial-gradient(circle_at_top_left,_rgba(219,70,255,0.14),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(0,160,255,0.10),_transparent_26%),#05050b]',
      blob1: 'bg-candy-purple/15',
      blob2: 'bg-candy-pink/10',
      blob3: 'bg-candy-blue/10',
    },
    cyan: {
      gradient: 'bg-[radial-gradient(circle_at_top_left,_rgba(0,240,255,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,100,200,0.12),_transparent_28%),#06060d]',
      blob1: 'bg-candy-blue/14',
      blob2: 'bg-candy-pink/10',
      blob3: 'bg-candy-mint/8',
    },
    auth: {
      gradient: 'bg-[radial-gradient(circle_at_top_left,_rgba(255,172,209,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(96,189,255,0.14),_transparent_32%),#05050b]',
      blob1: 'bg-candy-mint/12',
      blob2: 'bg-candy-purple/10',
      blob3: 'bg-candy-pink/8',
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${v.gradient}`}>
      {/* Floating blobs */}
      <motion.div
        animate={{ x: [0, 30, -20, 10, 0], y: [0, -40, 20, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -left-24 top-20 h-72 w-72 rounded-full ${v.blob1} blur-3xl`}
      />
      <motion.div
        animate={{ x: [0, -20, 40, -10, 0], y: [0, 30, -30, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute right-0 top-40 h-96 w-96 rounded-full ${v.blob2} blur-3xl`}
      />
      <motion.div
        animate={{ x: [0, 50, -30, 0], y: [0, -20, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute bottom-0 left-1/3 h-64 w-64 rounded-full ${v.blob3} blur-3xl`}
      />

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,_rgba(255,255,255,0.02)_0px,_rgba(255,255,255,0.02)_1px,_transparent_1px,_transparent_3px)]" />

      {/* Corner neon accents */}
      <div className="absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-candy-pink/30 to-transparent" />
      <div className="absolute left-0 top-0 h-32 w-px bg-gradient-to-b from-candy-pink/30 to-transparent" />
      <div className="absolute bottom-0 right-0 h-px w-32 bg-gradient-to-l from-candy-blue/30 to-transparent" />
      <div className="absolute bottom-0 right-0 h-32 w-px bg-gradient-to-t from-candy-blue/30 to-transparent" />
    </div>
  );
};

export default AnimatedBackground;
