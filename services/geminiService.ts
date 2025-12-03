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
          systemInstruction: "You are NeonAI, a Web3 automation architect embedded in NeonFlow. You help users build DeFi workflows. \n\nIMPORTANT: If the user asks to create a flow/strategy, you MUST return a valid JSON object wrapped in ```json``` blocks. The JSON should represent React Flow nodes and edges. \n\nStructure:\n{\n  \"nodes\": [\n    { \n      \"id\": \"1\", \n      \"type\": \"cyber\", \n      \"data\": { \n        \"label\": \"Trigger: Price\", \n        \"inputs\": [\"Asset Pair\"], \n        \"params\": { \"pair\": \"ETH/USDC\", \"threshold\": \"< 2000\" } \n      }, \n      \"position\": { \"x\": 100, \"y\": 100 } \n    }\n  ],\n  \"edges\": [{ \"id\": \"e1-2\", \"source\": \"1\", \"target\": \"2\" }]\n}\n\nRules:\n1. 'inputs' array defines left-side connection handles. \n2. 'params' object defines internal settings.\n3. Use 'Trigger', 'Action', 'Condition' as label prefixes.\n4. Layout: Trigger (Top) -> Condition (Middle) -> Action (Bottom).\n\nIf the user is just chatting, reply normally in a technical, cyberpunk tone.",
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
        contents: `Audit the following smart contract logic for security vulnerabilities:\n\n${code}`,
      });
      return response.text || "No analysis generated.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Analysis module offline.";
    }
  }
}

export const geminiService = new GeminiService();