import express from 'express';
import multer from 'multer';
import { Asset } from '../models/Asset.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadFile } from '../services/storageService.js';
import { parseAssetFromMedia } from '../services/aiService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// Upload travel media and parse asset with AI
router.post('/upload', verifyToken, upload.array('files', 6), asyncHandler(async (req, res) => {
  const {
    title,
    description,
    source_type,
    text,
    place_name,
    latitude,
    longitude
  } = req.body;

  const files = req.files || [];
  const original_media = [];

  for (const file of files) {
    const url = await uploadFile(file.buffer, file.originalname, file.mimetype);
    original_media.push({
      type: file.mimetype.startsWith('image/') ? 'image' : file.mimetype.startsWith('audio/') ? 'audio' : 'file',
      url,
      size: file.size,
      mime_type: file.mimetype
    });
  }

  const location = {
    latitude: latitude ? parseFloat(latitude) : undefined,
    longitude: longitude ? parseFloat(longitude) : undefined,
    place_name: place_name || ''
  };

  const media = {
    description,
    text,
    location: location.place_name || (location.latitude && location.longitude ? `${location.latitude},${location.longitude}` : undefined)
  };

  const parsed_data = await parseAssetFromMedia(media);

  const asset = new Asset({
    user_id: req.user._id,
    title: title || (files[0]?.originalname ? `Asset · ${files[0].originalname}` : 'Untitled Asset'),
    description: description || text || '',
    source_type: source_type || (files.length > 0 ? 'photo' : 'text'),
    original_media,
    parsed_data,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
      place_name: location.place_name
    }
  });

  await asset.save();

  res.status(201).json({
    message: 'Asset uploaded and parsed successfully',
    asset
  });
}));

// Create asset manually
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { title, description, source_type, original_media, parsed_data, location } = req.body;

  const asset = new Asset({
    user_id: req.user._id,
    title: title || 'Untitled Asset',
    description: description || '',
    source_type: source_type || 'mixed',
    original_media: original_media || [],
    parsed_data: parsed_data || {},
    location: location || {}
  });

  await asset.save();

  res.status(201).json({
    message: 'Asset created successfully',
    asset
  });
}));

// Get all assets for current user
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const assets = await Asset
    .find({ user_id: req.user._id })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Asset.countDocuments({ user_id: req.user._id });

  res.json({
    assets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single asset
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  if (asset.user_id.toString() !== req.user._id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json(asset);
}));

// Update asset
router.put('/:id', verifyToken, asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  if (asset.user_id.toString() !== req.user._id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  Object.assign(asset, req.body);
  asset.updated_at = new Date();
  await asset.save();

  res.json({
    message: 'Asset updated successfully',
    asset
  });
}));

// Delete asset
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  if (asset.user_id.toString() !== req.user._id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await Asset.deleteOne({ _id: req.params.id });

  res.json({ message: 'Asset deleted successfully' });
}));

export default router;
