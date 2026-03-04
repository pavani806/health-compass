import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const langInstruction = language === "hi"
      ? "Respond entirely in Hindi (Devanagari script)."
      : "Respond entirely in English.";

    const systemPrompt = `You are a medical triage AI assistant. You analyze reported symptoms and provide structured risk assessments. You are NOT a doctor and must always recommend professional consultation for moderate+ risks.

${langInstruction}

Given a list of symptoms, you MUST call the "triage_result" function with your analysis. Consider:
- Symptom combinations that may indicate serious conditions
- Duration and severity implications
- Age/gender risk factors if mentioned
- Multiple possible conditions

Be thorough but clear. Use simple language accessible to rural communities.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze these symptoms: ${symptoms}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "triage_result",
              description: "Return structured triage analysis",
              parameters: {
                type: "object",
                properties: {
                  risk_score: {
                    type: "number",
                    description: "Risk score from 0-100. 0-25=Low, 26-50=Moderate, 51-75=High, 76-100=Critical",
                  },
                  risk_level: {
                    type: "string",
                    enum: ["Low", "Moderate", "High", "Critical"],
                  },
                  possible_conditions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        probability: { type: "string", enum: ["Low", "Medium", "High"] },
                      },
                      required: ["name", "probability"],
                    },
                    description: "List of possible conditions",
                  },
                  recommendation: {
                    type: "string",
                    enum: ["Self-care", "Teleconsultation", "Hospital visit", "Emergency"],
                  },
                  recommendation_details: {
                    type: "string",
                    description: "Specific actionable advice for the patient",
                  },
                  explanation: {
                    type: "string",
                    description: "Clear explanation of WHY this risk score was given, referencing specific symptoms",
                  },
                  immediate_actions: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of immediate steps the patient should take",
                  },
                },
                required: [
                  "risk_score",
                  "risk_level",
                  "possible_conditions",
                  "recommendation",
                  "recommendation_details",
                  "explanation",
                  "immediate_actions",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "triage_result" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No structured response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-symptoms error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
