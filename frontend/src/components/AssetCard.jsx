import { motion } from 'framer-motion';

const AssetCard = ({ asset, onSelect, selected = false, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    key={asset._id}
    onClick={() => onClick?.(asset)}
    className={`rounded-[32px] border bg-black/40 p-5 shadow-glow backdrop-blur-xl cursor-pointer transition
      ${selected ? 'border-candy-pink ring-2 ring-candy-pink/30' : 'border-white/10 hover:border-white/20'}
    `}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
        {asset.source_type || 'mixed'}
      </span>
      {onSelect && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(asset._id); }}
          className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em] transition
            ${selected ? 'border-candy-pink bg-candy-pink/20 text-candy-pink' : 'border-white/20 hover:border-candy-blue text-white/60'}
          `}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      )}
    </div>

    <h3 className="mt-4 text-lg font-semibold text-white">{asset.title}</h3>
    {asset.description && (
      <p className="mt-2 text-sm text-white/60 line-clamp-2">{asset.description}</p>
    )}

    <div className="mt-4 flex flex-wrap gap-2">
      {(asset.parsed_data?.auto_tags?.emotions || []).slice(0, 2).map((tag) => (
        <span key={tag} className="rounded-full bg-candy-pink/15 px-3 py-1 text-[11px] text-candy-pink">
          {tag}
        </span>
      ))}
      {(asset.parsed_data?.auto_tags?.behaviors || []).slice(0, 1).map((tag) => (
        <span key={tag} className="rounded-full bg-candy-blue/15 px-3 py-1 text-[11px] text-candy-blue">
          {tag}
        </span>
      ))}
      {(asset.parsed_data?.auto_tags?.scenarios || []).slice(0, 2).map((tag) => (
        <span key={tag} className="rounded-full bg-candy-mint/15 px-3 py-1 text-[11px] text-candy-mint">
          {tag}
        </span>
      ))}
    </div>

    {asset.parsed_data?.cognitive_understanding && (
      <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/70 italic">
        &ldquo;{asset.parsed_data.cognitive_understanding.slice(0, 100)}&hellip;&rdquo;
      </div>
    )}

    {asset.original_media?.length > 0 && (
      <div className="mt-4 flex gap-2">
        {asset.original_media.slice(0, 2).map((media, idx) => (
          <div key={idx} className="h-20 w-20 flex-shrink-0 rounded-2xl bg-white/5 overflow-hidden border border-white/10">
            {media.type === 'image' ? (
              <img src={media.url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-white/40">{media.type}</div>
            )}
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

export default AssetCard;
