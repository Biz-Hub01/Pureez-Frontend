
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that categorizes products for an e-commerce marketplace. Based on the product title and description, determine:

1. Category: Choose from these exact options:
   - Furniture
   - Electronics
   - Kitchenware
   - Home Décor
   - Appliances
   - Lighting
   - Textiles
   - Storage
   - Outdoor
   - Office
   - Art & Collectibles

2. Room: Choose from these exact options (or leave blank if not applicable):
   - Living Room
   - Bedroom
   - Kitchen
   - Bathroom
   - Dining Room
   - Office
   - Outdoor
   - Kids Room
   - Hallway
   - Utility

Return your response as a JSON object with "category" and "room" fields. Only use the exact options provided above.

Example response: {"category": "Furniture", "room": "Living Room"}`
          },
          {
            role: 'user',
            content: `Title: ${title}\nDescription: ${description}`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      const categorization = JSON.parse(aiResponse);
      return new Response(JSON.stringify(categorization), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to default categorization
      return new Response(JSON.stringify({ 
        category: "Home Décor", 
        room: null 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in categorize-product function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
