import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function expandTraderAnalysis(reportData) {
  const prompt = `
You are an expert financial analyst and trading psychologist. Analyze this trading data and provide comprehensive, actionable insights:

📊 TRADER PROFILE:
- Trader Type: ${reportData.trader_prediction.predicted_type}
- Confidence Level: ${(reportData.trader_prediction.confidence * 100).toFixed(1)}%
- Total Trades: ${reportData.user_summary.total_trades}
- Win Rate: ${(reportData.user_summary.win_rate * 100).toFixed(1)}%
- Average Profit: ${reportData.user_summary.avg_profit.toFixed(2)}%
- Average Holding Time: ${reportData.user_summary.avg_holding_time.toFixed(1)} days
- Most Traded Stocks: ${Object.entries(reportData.user_summary.most_traded_stocks)
    .map(([stock, count]) => `${stock} (${count} trades)`)
    .join(", ")}

Provide a DETAILED, CREATIVE, and PERSONALIZED analysis with:

1. **tradingStyle**: Write 3-4 engaging sentences that tell a story about this trader's unique approach. Use vivid language and comparisons (e.g., "like a chess player" or "surfer riding waves"). Make it memorable and insightful.

2. **strengths**: List 4-5 specific strengths with rich detail. Each point should:
   - Start with an action verb
   - Include specific numbers/percentages where relevant
   - Explain WHY this is a strength
   - Be encouraging and specific

3. **improvements**: List 4-5 areas for growth with constructive framing:
   - Focus on opportunities, not weaknesses
   - Be specific about what could be better
   - Reference industry benchmarks where helpful
   - Use positive, growth-oriented language

4. **recommendations**: Provide 5-6 highly actionable, specific recommendations:
   - Each should be implementable within 1-2 weeks
   - Include specific tools, techniques, or strategies
   - Prioritize by impact (most important first)
   - Add WHY each recommendation matters
   - Mix technical, psychological, and strategic advice

5. **riskAssessment**: 2-3 sentences providing a balanced risk evaluation:
   - Mention specific risk factors
   - Compare to typical traders
   - Suggest one concrete way to reduce risk

6. **psychologicalProfile**: NEW FIELD - 2-3 sentences about trading psychology:
   - Infer their decision-making style
   - Comment on emotional discipline based on metrics
   - Suggest one mental framework that could help

7. **nextMilestone**: NEW FIELD - Define a clear, achievable next goal:
   - Should be specific and measurable
   - Timeline: 1-3 months
   - Motivating and realistic

8. **tradingScore**: NEW FIELD - Calculate an overall score (0-100):
   - Consider win rate, consistency, risk management
   - Provide brief 1-sentence justification

9. **topOpportunity**: NEW FIELD - Identify THE single biggest opportunity:
   - One clear action that could have maximum impact
   - Be specific and actionable

10. **celebrationMoment**: NEW FIELD - Highlight one achievement to celebrate:
    - Find something genuinely praiseworthy in their data
    - Be specific and genuine

Format your response as JSON with these EXACT keys:
{
  "tradingStyle": "string",
  "strengths": ["array", "of", "strings"],
  "improvements": ["array", "of", "strings"],
  "recommendations": ["array", "of", "strings"],
  "riskAssessment": "string",
  "psychologicalProfile": "string",
  "nextMilestone": "string",
  "tradingScore": number,
  "topOpportunity": "string",
  "celebrationMoment": "string"
}

IMPORTANT RULES:
- Return ONLY valid JSON, no markdown, no code blocks, no extra text
- Be creative, engaging, and personalized
- Use conversational but professional tone
- Include specific numbers and data points
- Make insights actionable and memorable
- Avoid generic advice - tailor everything to THIS trader's data
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7, // Increased for more creative responses
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    console.log("Raw Gemini response:", text);

    // Parse JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      console.log("Parsed AI insights:", parsedData);
      return parsedData;
    }

    throw new Error("Failed to parse Gemini response - no JSON found");
  } catch (error) {
    console.error("Error in expandTraderAnalysis:", error);
    throw error;
  }
}