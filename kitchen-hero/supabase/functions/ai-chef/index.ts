// supabase/functions/ai-chef/index.ts
// Deploy: supabase functions deploy ai-chef
// Set secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    const client = new Anthropic()

    if (action === 'generate-recipes') {
      const { ingredients, preferences } = payload
      const ingredientList = ingredients
        .map((i: { name: string; quantity: string; unit?: string }) =>
          `${i.name} (${i.quantity}${i.unit ? ' ' + i.unit : ''})`)
        .join(', ')

      const prompt = `You are a professional chef AI. Given these ingredients: ${ingredientList}
${preferences ? `\nDietary preferences: ${preferences}` : ''}
Generate exactly 3 diverse recipe suggestions. Return ONLY valid JSON:
{
  "recipes": [{
    "title": "string",
    "description": "string",
    "cuisine": "string",
    "prep_time_min": number,
    "cook_time_min": number,
    "servings": number,
    "difficulty": "easy"|"medium"|"hard",
    "tags": ["string"],
    "ingredients": [{"name":"string","amount":"string","unit":"string","available":boolean}],
    "steps": [{"step":number,"instruction":"string","duration_min":number,"tip":"string|null"}]
  }]
}`

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = (message.content[0] as { type: string; text: string }).text
      return new Response(text, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'scan-image') {
      const { base64, mimeType, scanType } = payload

      const prompt = scanType === 'fridge'
        ? `This is a fridge photo. Identify all food items. Return JSON only:
{"items":[{"name":"string","category":"protein|vegetable|fruit|dairy|grain|condiment|beverage|other","quantity":"string","unit":"string|null","emoji":"string"}],"confidence":0.0-1.0}`
        : `This is a grocery receipt. Extract all food items. Return JSON only:
{"items":[{"name":"string","category":"protein|vegetable|fruit|dairy|grain|condiment|beverage|other","quantity":"string","unit":"string|null","emoji":"string"}],"confidence":0.0-1.0}`

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
            { type: 'text', text: prompt },
          ],
        }],
      })

      const text = (message.content[0] as { type: string; text: string }).text
      return new Response(text, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
