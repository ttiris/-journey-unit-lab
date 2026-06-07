import { useState } from 'react';
import { motion } from 'framer-motion';
import { assetAPI } from '../api/apiClient';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceType, setSourceType] = useState('photo');
  const [placeName, setPlaceName] = useState('');
  const [files, setFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files);
    setFiles(selected);
    setError('');
    setStatusMessage('');
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setStatusMessage('');

    if (!description && files.length === 0) {
      setError('请添加描述或至少选择一个文件。');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('source_type', sourceType);
    formData.append('place_name', placeName);

    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    try {
      setLoading(true);
      const response = await assetAPI.create(formData);
      setStatusMessage('上传成功！资产已解析并保存。');
      setTitle('');
      setDescription('');
      setPlaceName('');
      setFiles([]);
    } catch (uploadError) {
      setError(uploadError?.error || uploadError?.message || '上传失败。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,105,180,0.12),_transparent_22%),radial-gradient(circle_at_bottom,_rgba(0,204,255,0.14),_transparent_28%),#07070d] pt-32 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-[40px] border border-white/10 bg-black/40 p-10 shadow-glow backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-candy-pink">资产上传</p>
              <h1 className="mt-3 text-4xl font-bold text-white">从旅行碎片创建设计资产。</h1>
              <p className="mt-4 max-w-2xl text-white/70">上传图片、音频或文字笔记，让 AI 提取触发点、情绪、行为和场景标签。</p>
            </div>
            <div className="rounded-[28px] border border-candy-blue/20 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.35em] text-candy-blue shadow-neon-blue">
              AI 解析引擎就绪
            </div>
          </div>

          <form onSubmit={handleUpload} className="mt-10 space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-glow">
                <span className="text-white">资产标题</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="清晨市场漫步"
                  className="mt-3 w-full rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-candy-pink"
                />
              </label>

              <label className="block rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-glow">
                <span className="text-white">地点 / 场景</span>
                <input
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="台北夜市"
                  className="mt-3 w-full rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-candy-blue"
                />
              </label>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-glow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-yellow">上传文件</p>
                  <p className="mt-2 text-sm text-white/70">拖拽图片、音频，或直接上传旅行笔记。</p>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70">最多 6 个文件</span>
              </div>
              <div className="mt-6 rounded-[28px] border border-dashed border-white/20 bg-black/20 p-8 text-center text-white/60">
                <input
                  type="file"
                  multiple
                  accept="image/*,audio/*,text/*"
                  onChange={handleFileChange}
                  className="w-full cursor-pointer opacity-0"
                  id="asset-upload-input"
                />
                <label htmlFor="asset-upload-input" className="cursor-pointer rounded-full border border-candy-pink px-6 py-3 text-sm font-semibold text-candy-pink transition hover:bg-candy-pink/10">
                  选择文件
                </label>
                <p className="mt-4 text-sm">或从桌面拖拽文件到此处。</p>
              </div>
              {files.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {files.map((file) => (
                    <div key={file.name + file.size} className="rounded-3xl border border-white/10 bg-black/30 p-4 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{file.name}</p>
                          <p className="text-xs text-white/60">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/60">{file.type.split('/')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="block rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-glow">
              <span className="text-white">体验描述</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述当下的瞬间、情绪、色彩、质感与行为。"
                rows={6}
                className="mt-3 w-full rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-candy-purple"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 shadow-glow">
                <span className="text-white/70">来源类型：</span>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none"
                >
                  <option value="photo">照片</option>
                  <option value="audio">音频</option>
                  <option value="text">文字</option>
                  <option value="mixed">混合</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue px-8 py-3 text-sm font-semibold text-dark-bg shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? '解析中…' : '上传并解析'}
              </button>
            </div>

            {statusMessage && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">{statusMessage}</div>}
            {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">{error}</div>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
