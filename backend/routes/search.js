import express from 'express';
import { Asset } from '../models/Asset.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Multi-dimensional search
router.get('/assets', verifyToken, asyncHandler(async (req, res) => {
  const {
    emotions,
    behaviors,
    scenarios,
    creativity_types,
    page = 1,
    limit = 10
  } = req.query;

  // Build query filter
  const filter = { user_id: req.user._id };

  if (emotions) {
    filter['parsed_data.auto_tags.emotions'] = {
      $in: Array.isArray(emotions) ? emotions : [emotions]
    };
  }

  if (behaviors) {
    filter['parsed_data.auto_tags.behaviors'] = {
      $in: Array.isArray(behaviors) ? behaviors : [behaviors]
    };
  }

  if (scenarios) {
    filter['parsed_data.auto_tags.scenarios'] = {
      $in: Array.isArray(scenarios) ? scenarios : [scenarios]
    };
  }

  if (creativity_types) {
    filter['parsed_data.auto_tags.creativity_types'] = {
      $in: Array.isArray(creativity_types) ? creativity_types : [creativity_types]
    };
  }

  // Execute query
  const skip = (page - 1) * limit;
  const assets = await Asset
    .find(filter)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Asset.countDocuments(filter);

  res.json({
    assets,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// Get available tags for filtering
router.get('/tags', verifyToken, asyncHandler(async (req, res) => {
  const assets = await Asset.find({ user_id: req.user._id });

  // Aggregate all unique tags
  const tags = {
    emotions: new Set(),
    behaviors: new Set(),
    scenarios: new Set(),
    creativity_types: new Set()
  };

  assets.forEach(asset => {
    if (asset.parsed_data?.auto_tags) {
      asset.parsed_data.auto_tags.emotions?.forEach(tag => tags.emotions.add(tag));
      asset.parsed_data.auto_tags.behaviors?.forEach(tag => tags.behaviors.add(tag));
      asset.parsed_data.auto_tags.scenarios?.forEach(tag => tags.scenarios.add(tag));
      asset.parsed_data.auto_tags.creativity_types?.forEach(tag => tags.creativity_types.add(tag));
    }
  });

  // Convert sets to arrays
  const tagsList = {
    emotions: Array.from(tags.emotions),
    behaviors: Array.from(tags.behaviors),
    scenarios: Array.from(tags.scenarios),
    creativity_types: Array.from(tags.creativity_types)
  };

  res.json(tagsList);
}));

export default router;
