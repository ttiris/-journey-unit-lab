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
      setError('Please add a description or select at least one file.');
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
      setStatusMessage('Upload successful! Asset parsed and saved.');
      setTitle('');
      setDescription('');
      setPlaceName('');
      setFiles([]);
    } catch (uploadError) {
      setError(uploadError?.error || uploadError?.message || 'Upload failed.');
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
              <p className="text-sm uppercase tracking-[0.35em] text-candy-pink">Asset upload</p>
              <h1 className="mt-3 text-4xl font-bold text-white">Create a design asset from travel fragments.</h1>
              <p className="mt-4 max-w-2xl text-white/70">Upload images, audio or text notes and let the AI extract triggers, emotions, behaviors, and scenario tags.</p>
            </div>
            <div className="rounded-[28px] border border-candy-blue/20 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.35em] text-candy-blue shadow-neon-blue">
              AI asset parser ready
            </div>
          </div>

          <form onSubmit={handleUpload} className="mt-10 space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-glow">
                <span className="text-white">Asset title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Morning market stroll"
                  className="mt-3 w-full rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-candy-pink"
                />
              </label>

              <label className="block rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-glow">
                <span className="text-white">Location or scene</span>
                <input
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Taipei night market"
                  className="mt-3 w-full rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-candy-blue"
                />
              </label>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-glow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-candy-yellow">Upload files</p>
                  <p className="mt-2 text-sm text-white/70">Drag images, audio, or upload your travel notes directly.</p>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70">Max 6 files</span>
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
                  Select files
                </label>
                <p className="mt-4 text-sm">or drag files here from your desktop.</p>
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
              <span className="text-white">Experience description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the moment, mood, colors, textures, and behaviors."
                rows={6}
                className="mt-3 w-full rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-candy-purple"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 shadow-glow">
                <span className="text-white/70">Source type:</span>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none"
                >
                  <option value="photo">Photo</option>
                  <option value="audio">Audio</option>
                  <option value="text">Text</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue px-8 py-3 text-sm font-semibold text-dark-bg shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Parsing asset…' : 'Upload and parse'}
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
