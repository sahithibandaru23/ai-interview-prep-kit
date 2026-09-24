import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateText } from "../services/generation/gemini";

export const chatWithAssistant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        success: false,
        message: "Message is required",
      });
      return;
    }

    const prompt = `
You are an AI Interview Assistant.

Help the user prepare for software engineering and technical interviews.

Give clear, practical and beginner-friendly answers.
When useful, provide examples, interview tips, sample answers, or follow-up questions.

User question:
${message.trim()}
`;

    const answer = await generateText(prompt);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Assistant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get AI assistant response",
    });
  }
};