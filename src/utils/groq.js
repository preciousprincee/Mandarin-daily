import { getCurriculumStage } from './gamification.js'

export async function generateLesson(apiKey, dayNumber, previousTopics = []) {
  const stage = getCurriculumStage(dayNumber)
  const prevTopicsText = previousTopics.length > 0
    ? `Previously covered topics: ${previousTopics.slice(-10).join(', ')}. Do NOT repeat these.`
    : 'This is the very first lesson.'

  const systemPrompt = `You are MandarinAI, an expert Mandarin Chinese teacher for complete beginners progressing to advanced. 
You create structured daily lessons that build progressively on each other.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`

  const userPrompt = `Generate a complete Mandarin lesson for Day ${dayNumber}.

Curriculum stage: "${stage.label}" — ${stage.desc}
${prevTopicsText}

Return ONLY this JSON structure:
{
  "dayNumber": ${dayNumber},
  "stage": "${stage.stage}",
  "topic": "short topic name (e.g. 'Greetings', 'Ordering Food')",
  "word": {
    "character": "汉字",
    "pinyin": "hàn zì",
    "meaning": "English meaning",
    "toneBreakdown": "tone number for each syllable e.g. 4th + 4th tone",
    "example": "A sentence using this word in Chinese",
    "examplePinyin": "pinyin for the example sentence",
    "exampleMeaning": "English translation of the sentence"
  },
  "phrase": {
    "chinese": "Full phrase in Chinese characters",
    "pinyin": "Full pinyin with tone marks",
    "meaning": "English meaning",
    "usage": "One sentence explaining when/how to use this",
    "audioHint": "Pronunciation tip focusing on the hardest part"
  },
  "grammar": {
    "rule": "The grammar rule name",
    "explanation": "Clear 1-2 sentence explanation for a beginner",
    "pattern": "Pattern structure e.g. Subject + 是 + Noun",
    "example": "Chinese example",
    "examplePinyin": "pinyin",
    "exampleMeaning": "English"
  },
  "toneLesson": {
    "title": "Tone tip title",
    "content": "Practical tip about Mandarin tones relevant to today's words",
    "practice": "A short phrase to practice the tones in today's lesson"
  },
  "culturalNote": "One interesting cultural fact related to today's topic (1-2 sentences)",
  "practicePrompt": "A conversational scenario for the user to practice today's content (e.g. 'Imagine you just met someone at a café. Introduce yourself using today's phrase.')"
}`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  // Strip any markdown fences if present
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(clean)
}

export async function generateSpeakingFeedback(apiKey, phrase, userTranscript) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      max_tokens: 300,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a friendly Mandarin pronunciation coach. Give brief, encouraging feedback. Respond in JSON only.'
        },
        {
          role: 'user',
          content: `Target phrase: "${phrase}"
User said (transcribed): "${userTranscript}"

Return JSON: { "score": 1-5, "feedback": "2-3 sentences of kind, specific feedback", "tip": "one actionable improvement tip" }`
        }
      ]
    })
  })

  if (!response.ok) throw new Error('Feedback API failed')
  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(clean)
}
