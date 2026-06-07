import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  source_type: {
    type: String,
    enum: ['photo', 'text', 'route', 'mixed'],
    required: true
  },
  original_media: [
    {
      type: String, // 'image', 'text', 'audio'
      url: String,
      size: Number, // in bytes
      mime_type: String
    }
  ],
  parsed_data: {
    triggers: [String],
    collected_inputs: [String],
    cognitive_understanding: String,
    emotional_reactions: [String],
    behaviors: [String],
    auto_tags: {
      emotions: [String],
      behaviors: [String],
      scenarios: [String],
      creativity_types: [String]
    }
  },
  custom_fields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  location: {
    latitude: Number,
    longitude: Number,
    place_name: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index for fast searching
assetSchema.index({ user_id: 1, created_at: -1 });
assetSchema.index({ 'parsed_data.auto_tags.emotions': 1 });
assetSchema.index({ 'parsed_data.auto_tags.behaviors': 1 });
assetSchema.index({ 'parsed_data.auto_tags.scenarios': 1 });
assetSchema.index({ 'parsed_data.auto_tags.creativity_types': 1 });

export const Asset = mongoose.model('Asset', assetSchema);
