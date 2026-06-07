import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-xl">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-candy-pink via-candy-purple to-candy-blue text-xs font-bold text-dark-bg">JU</div>
            <span className="text-sm font-semibold tracking-[0.12em] text-white">Journey Unit Lab</span>
          </div>
          <p className="mt-4 text-xs text-white/40">AI-powered design asset platform turning travel fragments into creative fuel.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Platform</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/upload" className="text-sm text-white/60 transition hover:text-candy-pink">Upload</Link>
            <Link to="/assets" className="text-sm text-white/60 transition hover:text-candy-blue">Library</Link>
            <Link to="/inspiration" className="text-sm text-white/60 transition hover:text-candy-purple">Inspiration</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Technology</p>
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-sm text-white/40">React · Vite</span>
            <span className="text-sm text-white/40">Node.js · Express</span>
            <span className="text-sm text-white/40">MongoDB · OpenAI</span>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Vibe</p>
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-sm text-white/40">Y2K Millennium</span>
            <span className="text-sm text-white/40">Candy Color Palette</span>
            <span className="text-sm text-white/40">Glass Morphism</span>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
        <p className="text-[11px] text-white/30">© 2026 Journey Unit Lab. Design assets from travel fragments.</p>
        <div className="flex gap-4">
          <span className="h-2 w-2 rounded-full bg-candy-pink/60" />
          <span className="h-2 w-2 rounded-full bg-candy-purple/60" />
          <span className="h-2 w-2 rounded-full bg-candy-blue/60" />
          <span className="h-2 w-2 rounded-full bg-candy-mint/60" />
          <span className="h-2 w-2 rounded-full bg-candy-yellow/60" />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
