import express from 'express';
import { Asset } from '../models/Asset.js';
import { InspirationOutput } from '../models/InspirationOutput.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateInspirationFromAssets } from '../services/aiService.js';

const router = express.Router();

// Generate inspiration from selected assets
router.post('/generate', verifyToken, asyncHandler(async (req, res) => {
  const { asset_ids, title } = req.body;

  if (!asset_ids || asset_ids.length === 0) {
    return res.status(400).json({ error: 'At least one asset is required' });
  }

  // Verify user owns all selected assets
  const assets = await Asset.find({
    _id: { $in: asset_ids },
    user_id: req.user._id
  });

  if (assets.length !== asset_ids.length) {
    return res.status(403).json({ error: 'Some assets not found or not authorized' });
  }

  // Call AI service to generate inspiration
  const generatedResult = await generateInspirationFromAssets(assets);

  // Save inspiration output
  const inspirationOutput = new InspirationOutput({
    designer_id: req.user._id,
    source_assets: asset_ids,
    combined_result: generatedResult,
    title: title || `Inspiration from ${assets.length} assets`
  });

  await inspirationOutput.save();

  res.status(201).json({
    message: 'Inspiration generated successfully',
    inspiration: inspirationOutput
  });
}));

// Get inspiration outputs for current user
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const saved_only = req.query.saved === 'true';

  const filter = { designer_id: req.user._id };
  if (saved_only) {
    filter.saved = true;
  }

  const outputs = await InspirationOutput
    .find(filter)
    .sort({ generated_at: -1 })
    .skip(skip)
    .limit(limit)
    .populate('source_assets');

  const total = await InspirationOutput.countDocuments(filter);

  res.json({
    inspirations: outputs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single inspiration
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const inspiration = await InspirationOutput
    .findById(req.params.id)
    .populate('source_assets');

  if (!inspiration) {
    return res.status(404).json({ error: 'Inspiration not found' });
  }

  if (inspiration.designer_id.toString() !== req.user._id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json(inspiration);
}));

// Save/unsave inspiration
router.patch('/:id/save', verifyToken, asyncHandler(async (req, res) => {
  const { saved } = req.body;

  const inspiration = await InspirationOutput.findById(req.params.id);

  if (!inspiration) {
    return res.status(404).json({ error: 'Inspiration not found' });
  }

  if (inspiration.designer_id.toString() !== req.user._id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  inspiration.saved = saved ?? !inspiration.saved;
  inspiration.updated_at = new Date();
  await inspiration.save();

  res.json({
    message: 'Inspiration updated',
    inspiration
  });
}));

// Delete inspiration
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const inspiration = await InspirationOutput.findById(req.params.id);

  if (!inspiration) {
    return res.status(404).json({ error: 'Inspiration not found' });
  }

  if (inspiration.designer_id.toString() !== req.user._id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await InspirationOutput.deleteOne({ _id: req.params.id });

  res.json({ message: 'Inspiration deleted' });
}));

export default router;
