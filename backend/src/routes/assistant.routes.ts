import { Router } from "express";
import { chatWithAssistant } from "../controllers/assistant.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/chat", authenticate, chatWithAssistant);

export default router;