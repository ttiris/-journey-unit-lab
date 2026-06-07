import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { assetAPI, inspirationAPI } from '../api/apiClient';
import AssetCard from '../components/AssetCard';
import Pagination from '../components/Pagination';

const InspirationGenerator = () => {
  const [assets, setAssets] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // History of generated inspirations
  const [inspirations, setInspirations] = useState([]);
  const [inspPagination, setInspPagination] = useState({ page: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('generate');

  const fetchAssets = useCallback(async (page = 1) => {
    setLoadingAssets(true);
    setError('');
    try {
      const response = await assetAPI.getAll(page, 12);
      setAssets(response.assets || []);
      setPagination(response.pagination || { page, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err?.error || 'Failed to load assets');
    } finally {
      setLoadingAssets(false);
    }
  }, []);

  const fetchInspirations = useCallback(async (page = 1) => {
    try {
      const response = await inspirationAPI.getAll(page, 6);
      setInspirations(response.inspirations || []);
      setInspPagination(response.pagination || { page, totalPages: 1 });
    } catch {
      // history may be empty
    }
  }, []);

  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  useEffect(() => {
    fetchInspirations(1);
  }, [fetchInspirations]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0) {
      setError('请至少选择一个资产来生成灵感。');
      return;
    }
    setGenerating(true);
    setError('');
    setSuccessMsg('');
    try {
      const result = await inspirationAPI.generate(selectedIds, `Inspiration · ${new Date().toLocaleDateString()}`);
      setSuccessMsg('灵感已生成！请查看历史记录。');
      setSelectedIds([]);
      fetchInspirations(1);
    } catch (err) {
      setError(err?.error || '生成失败');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,240,255,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,100,200,0.14),_transparent_28%),#06060d] pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-[40px] border border-white/10 bg-black/40 p-10 shadow-glow backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-candy-yellow">灵感</p>
              <h1 className="mt-3 text-4xl font-bold text-white">设计灵感生成器</h1>
              <p className="mt-4 max-w-2xl text-white/70">选择旅行资产，让 AI 融合生成统一的设计概念。</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('generate')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition
                  ${activeTab === 'generate'
                    ? 'bg-candy-pink/20 border border-candy-pink text-candy-pink'
                    : 'border border-white/10 text-white/70 hover:border-white/30'
                  }
                `}
              >
                生成
              </button>
              <button
                onClick={() => { setActiveTab('history'); fetchInspirations(1); }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition
                  ${activeTab === 'history'
                    ? 'bg-candy-pink/20 border border-candy-pink text-candy-pink'
                    : 'border border-white/10 text-white/70 hover:border-white/30'
                  }
                `}
              >
                历史记录
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">{error}</div>
          )}
          {successMsg && (
            <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">{successMsg}</div>
          )}

          {activeTab === 'generate' && (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow">
                <span className="text-sm text-white/70">已选：<strong className="text-candy-pink">{selectedIds.length}</strong> 个资产</span>
                <button
                  onClick={handleGenerate}
                  disabled={generating || selectedIds.length === 0}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue px-8 py-3 text-sm font-semibold text-dark-bg shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {generating ? '生成灵感中…' : '生成灵感'}
                </button>
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setSelectedIds([])}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-white/30"
                  >
                    清除选择
                  </button>
                )}
              </div>

              <div className="mt-8">
                {loadingAssets ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-48 animate-pulse rounded-[32px] bg-white/5" />
                    ))}
                  </div>
                ) : assets.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-xl font-medium text-white/60">暂无可用资产</p>
                    <p className="mt-3 text-sm text-white/40">请先从上传页面上传资产以生成灵感。</p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {assets.map((asset) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        selected={selectedIds.includes(asset._id)}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => fetchAssets(p)} />
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div className="mt-8 space-y-6">
              {inspirations.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center">
                  <p className="text-xl font-medium text-white/60">还没有灵感记录</p>
                  <p className="mt-3 text-sm text-white/40">使用生成标签页创建你的第一份灵感。</p>
                </div>
              ) : (
                <>
                  {inspirations.map((insp) => (
                    <motion.div
                      key={insp._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-glow"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{insp.title}</h3>
                          <p className="mt-1 text-xs text-white/40">{new Date(insp.generated_at).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await inspirationAPI.save(insp._id, !insp.saved);
                                fetchInspirations(inspPagination.page);
                              } catch {}
                            }}
                            className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em] transition
                              ${insp.saved
                                ? 'border-candy-pink bg-candy-pink/10 text-candy-pink'
                                : 'border-white/10 text-white/60 hover:border-candy-pink'
                              }
                            `}
                          >
                            {insp.saved ? '已保存' : '保存'}
                          </button>
                        </div>
                      </div>

                      {insp.combined_result?.summary && (
                        <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm italic text-white/70">
                          &ldquo;{insp.combined_result.summary}&rdquo;
                        </div>
                      )}

                      {insp.combined_result?.design_suggestions?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-candy-yellow">设计建议</p>
                          <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-white/70">
                            {insp.combined_result.design_suggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {insp.combined_result?.merged_tags && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(insp.combined_result.merged_tags.emotions || []).map((t) => (
                            <span key={t} className="rounded-full bg-candy-pink/15 px-2 py-1 text-[10px] text-candy-pink">{t}</span>
                          ))}
                          {(insp.combined_result.merged_tags.behaviors || []).map((t) => (
                            <span key={t} className="rounded-full bg-candy-blue/15 px-2 py-1 text-[10px] text-candy-blue">{t}</span>
                          ))}
                          {(insp.combined_result.merged_tags.scenarios || []).map((t) => (
                            <span key={t} className="rounded-full bg-candy-mint/15 px-2 py-1 text-[10px] text-candy-mint">{t}</span>
                          ))}
                          {(insp.combined_result.merged_tags.creativity_types || []).map((t) => (
                            <span key={t} className="rounded-full bg-candy-purple/15 px-2 py-1 text-[10px] text-candy-purple">{t}</span>
                          ))}
                        </div>
                      )}

                      {insp.combined_result?.creative_notes && (
                        <p className="mt-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/50">{insp.combined_result.creative_notes}</p>
                      )}

                      {insp.source_assets?.length > 0 && (
                        <p className="mt-4 text-xs text-white/30">
                         来源资产：{insp.source_assets.map(a => a.title || a._id).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  ))}
                  {inspPagination.totalPages > 1 && (
                    <Pagination page={inspPagination.page} totalPages={inspPagination.totalPages} onPageChange={(p) => fetchInspirations(p)} />
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InspirationGenerator;
