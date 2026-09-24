import { Response } from "express";

import { Kit } from "../models/Kit";
import { AuthRequest } from "../middleware/auth.middleware";
import { buildKit } from "../services/kitPipeline";

// =====================================================
// CREATE KIT
// POST /api/kits
// =====================================================

export const createKit = async (
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

    const {
      jd,
      company_url,
      days,
      company,
      location,
    } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!jd || !company_url || days === undefined) {
      res.status(400).json({
        success: false,
        message: "Job description, company URL and days are required",
      });
      return;
    }

    if (typeof jd !== "string" || jd.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Job description cannot be empty",
      });
      return;
    }

    if (typeof company_url !== "string") {
      res.status(400).json({
        success: false,
        message: "Company URL must be a string",
      });
      return;
    }

    if (!Number.isInteger(days) || days < 1 || days > 60) {
      res.status(400).json({
        success: false,
        message: "Days must be an integer between 1 and 60",
      });
      return;
    }

    // -----------------------------
    // Create initial kit
    // -----------------------------

    const kit = await Kit.create({
      userId: req.userId,

      source: {
        company: typeof company === "string" ? company : "",
        company_url,
        role: "",
        location: typeof location === "string" ? location : "",
        jd_chars: jd.length,
        researched_at: "",
        pages_used: [],
      },

      company_brief: {
        summary: "",
        what_they_do: "",
        sources: [],
      },

      role: {
        title: "",
        seniority: "",
        responsibilities: [],
        requirements: [],
      },

      questions: [],

      flashcards: [],

      schedule: {
        days_available: days,
        days: [],
      },

      coverage: {
        uncovered_requirement_ids: [],
        passes: 0,
      },

      status: "generating",
    });

    // -----------------------------
    // Run complete generation pipeline
    // -----------------------------

    try {
      const generatedKit = await buildKit({
        jd,
        company_url,
        days,
        company,
        location,
      });

      // -----------------------------
      // Save generated data
      // -----------------------------

      kit.source = generatedKit.source;
      kit.company_brief = generatedKit.company_brief;
      kit.role = generatedKit.role;
      kit.questions = generatedKit.questions;
      kit.flashcards = generatedKit.flashcards;
      kit.schedule = generatedKit.schedule;
      kit.coverage = generatedKit.coverage;
      kit.status = "ready";

      await kit.save();

      res.status(201).json({
        success: true,
        message: "Kit generated successfully",
        kitId: kit._id,
        kit,
      });
    } catch (pipelineError) {
      console.error("Kit pipeline error:", pipelineError);

      kit.status = "failed";

      await kit.save();

      res.status(500).json({
        success: false,
        message: "Failed to generate interview prep kit",
        kitId: kit._id,
      });
    }
  } catch (error) {
    console.error("Create kit error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create kit",
    });
  }
};

// =====================================================
// GET MY KITS
// GET /api/kits
// =====================================================

export const getMyKits = async (
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

    const kits = await Kit.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: kits.length,
      kits,
    });
  } catch (error) {
    console.error("Get kits error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch kits",
    });
  }
};

// =====================================================
// GET KIT BY ID
// GET /api/kits/:id
// =====================================================

export const getKitById = async (
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

    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Kit ID is required",
      });
      return;
    }

    const kit = await Kit.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!kit) {
      res.status(404).json({
        success: false,
        message: "Kit not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      kit,
    });
  } catch (error) {
    console.error("Get kit by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch kit",
    });
  }
};