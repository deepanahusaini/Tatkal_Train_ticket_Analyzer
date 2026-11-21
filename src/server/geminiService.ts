import { GoogleGenAI, Type } from '@google/genai';
import type { WaitlistPredictionResult } from '../types/railway.ts';

const MODEL_NAME = 'gemini-4-hydrogen';

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface GeminiPredictionExplanation {
  summary: string;
  tacticalAdvice: string[];
  riskSignals: string[];
  modelUsed: string;
}

export async function generatePredictionExplanation(
  prediction: WaitlistPredictionResult
): Promise<{ explanation: GeminiPredictionExplanation | null; error: string | null }> {
  const ai = getClient();
  if (!ai) {
    return {
      explanation: null,
      error: 'Gemini API key is not configured on the server; displaying calibrated ML model output only.',
    };
  }

  try {
    const prompt = `Analyze this Indian Railways waitlist confirmation probability estimate and provide concise, practical passenger intelligence.
Train: ${prediction.trainNumber} ${prediction.trainName}
Travel Date: ${prediction.travelDate}
Class: ${prediction.travelClass} | Quota: ${prediction.quota}
Current Status: ${prediction.waitlistType} ${prediction.waitlistNumber}
Calibrated ML Confirmation Probability: ${prediction.confirmationProbability}% (CI: ${prediction.confidenceInterval[0]}%-${prediction.confidenceInterval[1]}%, Confidence: ${prediction.confidenceLevel})
Key Contributing Factors:
${prediction.factors.map((f) => `- ${f.name} (impact ${f.impact >= 0 ? '+' : ''}${f.impact}): ${f.detail}`).join('\n')}
${prediction.anomalyNote ? `Anomaly Flag: ${prediction.anomalyNote}` : ''}

Return strictly grounded, transparent analysis without promising guaranteed confirmation. Keep summary under 55 words, 3 concise tactical advice bullets, and 2 concise risk signals.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction:
          'You are RailPulse AI, a senior Indian Railways ticketing and Tatkal analytics advisor. Be precise, objective, transparent about uncertainty, and never guarantee ticket confirmation.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Concise 2-sentence explanation of why the confirmation probability is at this level.',
            },
            tacticalAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Up to 3 actionable booking or backup strategies for this corridor and class.',
            },
            riskSignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Up to 2 specific risk signals affecting waitlist clearance.',
            },
          },
          required: ['summary', 'tacticalAdvice', 'riskSignals'],
        },
      },
    });

    const raw = (response.text ?? '').trim();
    if (!raw) {
      return { explanation: null, error: 'Empty response received from Gemini model.' };
    }

    const parsed = JSON.parse(raw) as {
      summary: string;
      tacticalAdvice: string[];
      riskSignals: string[];
    };

    return {
      explanation: {
        summary: parsed.summary,
        tacticalAdvice: Array.isArray(parsed.tacticalAdvice) ? parsed.tacticalAdvice.slice(0, 3) : [],
        riskSignals: Array.isArray(parsed.riskSignals) ? parsed.riskSignals.slice(0, 2) : [],
        modelUsed: MODEL_NAME,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected Gemini API error';
    console.error('[RailPulse Gemini Service Error]:', message);
    return {
      explanation: null,
      error: `Gemini narrative explanation unavailable: ${message}`,
    };
  }
}
