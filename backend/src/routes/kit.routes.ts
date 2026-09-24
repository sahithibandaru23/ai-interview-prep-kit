import { Router } from "express";

import {
  createKit,
  getMyKits,
  getKitById,
} from "../controllers/kit.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createKit);

router.get("/", authenticate, getMyKits);

router.get("/:id", authenticate, getKitById);

export default router;