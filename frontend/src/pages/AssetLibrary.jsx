import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { assetAPI, searchAPI } from '../api/apiClient';
import AssetCard from '../components/AssetCard';
import TagFilter from '../components/TagFilter';
import Pagination from '../components/Pagination';

const AssetLibrary = () => {
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [availableTags, setAvailableTags] = useState({ emotions: [], behaviors: [], scenarios: [], creativity_types: [] });
  const [selectedTags, setSelectedTags] = useState({ emotions: [], behaviors: [], scenarios: [], creativity_types: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailAsset, setDetailAsset] = useState(null);

  const fetchAssets = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      let response;
      const hasFilters = Object.values(selectedTags).some(arr => arr.length > 0);
      if (hasFilters) {
        const params = { page, limit: 9 };
        if (selectedTags.emotions.length) params.emotions = selectedTags.emotions;
        if (selectedTags.behaviors.length) params.behaviors = selectedTags.behaviors;
        if (selectedTags.scenarios.length) params.scenarios = selectedTags.scenarios;
        if (selectedTags.creativity_types.length) params.creativity_types = selectedTags.creativity_types;
        response = await searchAPI.search(params);
      } else {
        response = await assetAPI.getAll(page, 9);
      }
      setAssets(response.assets || []);
      setPagination(response.pagination || { page, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err?.error || '加载资产失败');
    } finally {
      setLoading(false);
    }
  }, [selectedTags]);

  const fetchTags = useCallback(async () => {
    try {
      const tags = await searchAPI.getTags();
      setAvailableTags(tags);
    } catch {
      // tags may not be available if no assets exist
    }
  }, []);

  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleTagToggle = (dimension, tag) => {
    setSelectedTags((prev) => {
      const current = [...prev[dimension]];
      const index = current.indexOf(tag);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(tag);
      }
      return { ...prev, [dimension]: current };
    });
  };

  const clearFilters = () => {
    setSelectedTags({ emotions: [], behaviors: [], scenarios: [], creativity_types: [] });
  };

  const hasActiveFilters = Object.values(selectedTags).some(arr => arr.length > 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,70,255,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(0,160,255,0.12),_transparent_24%),#05050b] pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-[40px] border border-white/10 bg-black/40 p-10 shadow-glow backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-candy-purple">资产库</p>
              <h1 className="mt-3 text-4xl font-bold text-white">你的设计资产</h1>
              <p className="mt-4 max-w-2xl text-white/70">
                浏览、筛选和管理 AI 解析后的旅行资产。 {pagination.total > 0 && <span className="text-candy-pink">共 {pagination.total} 个资产</span>}
              </p>
            </div>
          </div>

          {/* Tag Filter Section */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TagFilter
              label="情绪"
              tags={availableTags.emotions}
              selected={selectedTags.emotions}
              onChange={(tag) => handleTagToggle('emotions', tag)}
              colorClass="candy-pink"
            />
            <TagFilter
              label="行为"
              tags={availableTags.behaviors}
              selected={selectedTags.behaviors}
              onChange={(tag) => handleTagToggle('behaviors', tag)}
              colorClass="candy-blue"
            />
            <TagFilter
              label="场景"
              tags={availableTags.scenarios}
              selected={selectedTags.scenarios}
              onChange={(tag) => handleTagToggle('scenarios', tag)}
              colorClass="candy-mint"
            />
            <TagFilter
              label="创意类型"
              tags={availableTags.creativity_types}
              selected={selectedTags.creativity_types}
              onChange={(tag) => handleTagToggle('creativity_types', tag)}
              colorClass="candy-purple"
            />
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-white/50">当前筛选</span>
              <button
                onClick={clearFilters}
                className="rounded-full border border-candy-pink/30 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-candy-pink transition hover:bg-candy-pink/10"
              >
                清除全部
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">{error}</div>
          )}

          {/* Asset Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-[32px] bg-white/5" />
                ))}
              </div>
            ) : assets.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center">
                <p className="text-xl font-medium text-white/60">还没有资产</p>
                <p className="mt-3 text-sm text-white/40">从上传页面添加你的第一个旅行片段。</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {assets.map((asset) => (
                  <AssetCard key={asset._id} asset={asset} onClick={(a) => setDetailAsset(a)} />
                ))}
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => fetchAssets(p)}
              />
            </div>
          )}
        </motion.div>

        {/* Detail Modal */}
        {detailAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setDetailAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[36px] border border-white/10 bg-black/80 p-8 shadow-glow backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-pink">{detailAsset.source_type}</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{detailAsset.title}</h2>
                </div>
                <button onClick={() => setDetailAsset(null)} className="rounded-full border border-white/10 px-3 py-1 text-white/70 transition hover:border-white/30">✕</button>
              </div>

              {detailAsset.description && (
                <p className="mt-4 text-white/70">{detailAsset.description}</p>
              )}

              {detailAsset.parsed_data && (
                <div className="mt-6 space-y-5">
                  {detailAsset.parsed_data.triggers?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-candy-yellow">触发点</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {detailAsset.parsed_data.triggers.map((t) => (
                          <span key={t} className="rounded-full bg-candy-yellow/10 px-3 py-1 text-xs text-candy-yellow">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailAsset.parsed_data.emotional_reactions?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-candy-pink">情绪反应</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {detailAsset.parsed_data.emotional_reactions.map((e) => (
                          <span key={e} className="rounded-full bg-candy-pink/10 px-3 py-1 text-xs text-candy-pink">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailAsset.parsed_data.behaviors?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-candy-blue">行为</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {detailAsset.parsed_data.behaviors.map((b) => (
                          <span key={b} className="rounded-full bg-candy-blue/10 px-3 py-1 text-xs text-candy-blue">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailAsset.parsed_data.cognitive_understanding && (
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-candy-purple">认知理解</p>
                      <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm italic text-white/70">
                        &ldquo;{detailAsset.parsed_data.cognitive_understanding}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Auto Tags */}
                  {detailAsset.parsed_data.auto_tags && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {detailAsset.parsed_data.auto_tags.emotions?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-white/50">情绪标签</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {detailAsset.parsed_data.auto_tags.emotions.map((t) => (
                              <span key={t} className="rounded-lg bg-candy-pink/10 px-2 py-0.5 text-[10px] text-candy-pink">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {detailAsset.parsed_data.auto_tags.behaviors?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-white/50">行为标签</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {detailAsset.parsed_data.auto_tags.behaviors.map((t) => (
                              <span key={t} className="rounded-lg bg-candy-blue/10 px-2 py-0.5 text-[10px] text-candy-blue">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {detailAsset.parsed_data.auto_tags.scenarios?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-white/50">场景标签</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {detailAsset.parsed_data.auto_tags.scenarios.map((t) => (
                              <span key={t} className="rounded-lg bg-candy-mint/10 px-2 py-0.5 text-[10px] text-candy-mint">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {detailAsset.parsed_data.auto_tags.creativity_types?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-white/50">创意标签</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {detailAsset.parsed_data.auto_tags.creativity_types.map((t) => (
                              <span key={t} className="rounded-lg bg-candy-purple/10 px-2 py-0.5 text-[10px] text-candy-purple">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {detailAsset.location?.place_name && (
                <p className="mt-6 text-xs text-white/40">📍 {detailAsset.location.place_name}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssetLibrary;
