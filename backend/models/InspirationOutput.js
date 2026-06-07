import mongoose from 'mongoose';

const inspirationOutputSchema = new mongoose.Schema({
  designer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source_assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    }
  ],
  combined_result: {
    summary: String,
    design_suggestions: [String],
    merged_tags: {
      emotions: [String],
      behaviors: [String],
      scenarios: [String],
      creativity_types: [String]
    },
    creative_notes: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Untitled Inspiration'
  },
  generated_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index for fast retrieval
inspirationOutputSchema.index({ designer_id: 1, generated_at: -1 });
inspirationOutputSchema.index({ saved: 1 });

export const InspirationOutput = mongoose.model('InspirationOutput', inspirationOutputSchema);
