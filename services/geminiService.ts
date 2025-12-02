import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI;
  private modelId: string = "gemini-2.5-flash"; // Optimized for chat speed

  constructor() {
    // API Key is assumed to be in process.env.API_KEY per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chat(message: string, history: { role: string; parts: { text: string }[] }[] = []): Promise<string> {
    try {
      const chat = this.ai.chats.create({
        model: this.modelId,
        config: {
          systemInstruction: "You are NeonAI, a Web3 automation expert embedded in the NeonFlow platform. You help users write smart contract logic, debug DeFi flows, and analyze market trends. Your tone is technical, concise, and slightly cyberpunk. You prefer code blocks for logic.",
          temperature: 0.7,
        },
        history: history.map(h => ({
          role: h.role,
          parts: h.parts
        }))
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message });
      return response.text || "Access denied. Network anomaly detected.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Connection lost to the neural net. Please check your API credentials.";
    }
  }

  async analyzeCode(code: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `Audit the following pseudo-code or smart contract logic for potential security vulnerabilities and logic flaws. Be brief and list critical issues first:\n\n${code}`,
      });
      return response.text || "No analysis generated.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Analysis module offline.";
    }
  }
}

export const geminiService = new GeminiService();