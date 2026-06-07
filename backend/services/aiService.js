import axios from 'axios';

const AI_SERVICE = process.env.AI_SERVICE || 'OPENAI';

// Initialize AI client based on environment
let aiClient = null;

if (AI_SERVICE === 'OPENAI') {
  aiClient = {
    model: process.env.OPENAI_MODEL || 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY
  };
} else if (AI_SERVICE === 'CLAUDE') {
  aiClient = {
    model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
    apiKey: process.env.CLAUDE_API_KEY
  };
}

/**
 * Parse travel fragments into structured asset data
 * @param {Object} media - Original media (image description, text, location)
 * @returns {Promise<Object>} Parsed asset data with 5 dimensions + auto tags
 */
export const parseAssetFromMedia = async (media) => {
  const prompt = `
You are an expert in analyzing travel experiences and extracting design insights.

Given the following travel fragment:
${media.description || ''}
${media.text || ''}
${media.location ? `Location: ${media.location}` : ''}

Please analyze this travel experience and extract:
1. Triggers (what sparked this moment?)
2. Collected Inputs (what information/details were captured?)
3. Cognitive Understanding (what was learned or realized?)
4. Emotional Reactions (what emotions were felt?)
5. Behaviors (what actions or interactions occurred?)

Also generate searchable tags for:
- Emotions (e.g., joy, nostalgia, wonder)
- Behaviors (e.g., exploration, interaction, contemplation)
- Scenarios (e.g., urban, nature, cultural)
- Creativity Types (e.g., visual, narrative, experiential)

Return JSON format:
{
  "triggers": ["item1", "item2"],
  "collected_inputs": ["input1", "input2"],
  "cognitive_understanding": "summary",
  "emotional_reactions": ["emotion1", "emotion2"],
  "behaviors": ["behavior1", "behavior2"],
  "auto_tags": {
    "emotions": ["tag1"],
    "behaviors": ["tag1"],
    "scenarios": ["tag1"],
    "creativity_types": ["tag1"]
  }
}
  `;

  try {
    let response;

    if (AI_SERVICE === 'OPENAI') {
      response = await callOpenAI(prompt);
    } else if (AI_SERVICE === 'CLAUDE') {
      response = await callClaude(prompt);
    }

    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;
  } catch (error) {
    console.error('Error parsing asset from media:', error);
    throw new Error('Failed to parse travel experience: ' + error.message);
  }
};

/**
 * Generate inspiration from selected assets
 * @param {Array<Object>} assets - Selected assets to combine
 * @returns {Promise<Object>} Generated inspiration result
 */
export const generateInspirationFromAssets = async (assets) => {
  // Aggregate data from selected assets
  const assetSummaries = assets.map(asset => ({
    title: asset.title,
    emotions: asset.parsed_data?.auto_tags?.emotions || [],
    behaviors: asset.parsed_data?.auto_tags?.behaviors || [],
    scenarios: asset.parsed_data?.auto_tags?.scenarios || [],
    triggers: asset.parsed_data?.triggers || [],
    cognitive_understanding: asset.parsed_data?.cognitive_understanding || ''
  }));

  const prompt = `
You are a creative design strategist. Analyze these travel experience assets and generate a unified design concept.

Assets:
${JSON.stringify(assetSummaries, null, 2)}

Please generate:
1. A comprehensive summary of the combined insights
2. 3-5 specific design suggestions
3. Merged tags that represent the collective theme

Return JSON format:
{
  "summary": "comprehensive insight summary",
  "design_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "merged_tags": {
    "emotions": ["emotion1", "emotion2"],
    "behaviors": ["behavior1"],
    "scenarios": ["scenario1"],
    "creativity_types": ["type1", "type2"]
  },
  "creative_notes": "additional creative direction"
}
  `;

  try {
    let response;

    if (AI_SERVICE === 'OPENAI') {
      response = await callOpenAI(prompt);
    } else if (AI_SERVICE === 'CLAUDE') {
      response = await callClaude(prompt);
    }

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const generated = JSON.parse(jsonMatch[0]);

    return generated;
  } catch (error) {
    console.error('Error generating inspiration:', error);
    throw new Error('Failed to generate inspiration: ' + error.message);
  }
};

// ============ Helper Functions ============

async function callOpenAI(prompt) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: aiClient.model,
      messages: [
        {
          role: 'system',
          content: 'You are a design insight expert. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    },
    {
      headers: {
        'Authorization': `Bearer ${aiClient.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

async function callClaude(prompt) {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: aiClient.model,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    {
      headers: {
        'x-api-key': aiClient.apiKey,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.content[0].text;
}
