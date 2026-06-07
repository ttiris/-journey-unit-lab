const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-candy-blue disabled:cursor-not-allowed disabled:opacity-30"
      >
        Prev
      </button>
      {start > 1 && <span className="text-white/30">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-full px-4 py-2 text-sm transition
            ${p === page
              ? 'bg-candy-pink/20 border border-candy-pink text-candy-pink'
              : 'border border-white/10 text-white/70 hover:border-white/30'
            }
          `}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="text-white/30">…</span>}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-candy-blue disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
