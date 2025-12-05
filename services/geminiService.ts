import { GoogleGenAI, Type } from "@google/genai";
import { Payer, TransactionType, SmartParseResult } from "../types";

// Note: In a real production app, API keys should not be exposed on the client side like this unless strictly controlled.
// We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTransactionWithGemini = async (input: string): Promise<SmartParseResult | null> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Input: "${input}"
      
      Current Date: ${today}
      Context: This is a family expense tracker between "筠" (Me/User) and "古" (Family member).
      Common items: 餐費 (Meals), 家用費 (Household), 其他 (Others).
      
      Tasks:
      1. Extract the item name (default to '其他' if unclear).
      2. Extract amount (number).
      3. Determine the date formatted as YYYY-MM-DD. "Yesterday" means ${today} minus 1 day.
      4. Determine who paid (ME or FRIEND). 
         - If text says "I paid", "筠 paid", "筠出的", "owed me", it is ME (筠). 
         - If text says "古 paid", "古出的", "owed him/her", it is FRIEND (古).
      5. Determine type: If money is being returned/settled, it is REPAYMENT. If a new purchase/loan happens, it is DEBT.
      
      Output JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            payer: { type: Type.STRING, enum: [Payer.ME, Payer.FRIEND] },
            type: { type: Type.STRING, enum: [TransactionType.DEBT, TransactionType.REPAYMENT] }
          },
          required: ["item", "amount", "date", "payer", "type"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const result = JSON.parse(text) as SmartParseResult;
    return result;

  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};
// Removed getSettlementAdvice as it is no longer requested.