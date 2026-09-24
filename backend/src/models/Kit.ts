import mongoose, { Document, Schema } from "mongoose";

export interface IKit extends Document {
  userId: mongoose.Types.ObjectId;

  source: {
    company: string;
    company_url: string;
    role: string;
    location: string;
    jd_chars: number;
    researched_at: string;
    pages_used: string[];
  };

  company_brief: {
    summary: string;
    what_they_do: string;
    sources: string[];
  };

  role: {
    title: string;
    seniority: string;
    responsibilities: string[];
    requirements: {
      id: string;
      text: string;
      kind: "technical" | "behavioural" | "domain";
      priority: "must" | "nice";
    }[];
  };

  questions: {
    id: string;
    requirement_ids: string[];
    category:
      | "technical"
      | "behavioural"
      | "system-design"
      | "company-fit";
    prompt: string;
    answer_outline: string;
    difficulty: number;
  }[];

  flashcards: {
    id: string;
    front: string;
    back: string;
    requirement_ids: string[];
  }[];

  schedule: {
    days_available: number;
    days: {
      day: number;
      focus: string;
      question_ids: string[];
      minutes: number;
    }[];
  };

  coverage: {
    uncovered_requirement_ids: string[];
    passes: number;
  };

  status: "draft" | "generating" | "ready" | "failed";

  createdAt: Date;
  updatedAt: Date;
}

const kitSchema = new Schema<IKit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    source: {
      company: {
        type: String,
        default: "",
      },
      company_url: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      jd_chars: {
        type: Number,
        default: 0,
      },
      researched_at: {
        type: String,
        default: "",
      },
      pages_used: {
        type: [String],
        default: [],
      },
    },

    company_brief: {
      summary: {
        type: String,
        default: "",
      },
      what_they_do: {
        type: String,
        default: "",
      },
      sources: {
        type: [String],
        default: [],
      },
    },

    role: {
      title: {
        type: String,
        default: "",
      },
      seniority: {
        type: String,
        default: "",
      },
      responsibilities: {
        type: [String],
        default: [],
      },
      requirements: {
        type: [
          {
            id: String,
            text: String,
            kind: String,
            priority: String,
          },
        ],
        default: [],
      },
    },

    questions: {
      type: [
        {
          id: String,
          requirement_ids: [String],
          category: String,
          prompt: String,
          answer_outline: String,
          difficulty: Number,
        },
      ],
      default: [],
    },

    flashcards: {
      type: [
        {
          id: String,
          front: String,
          back: String,
          requirement_ids: [String],
        },
      ],
      default: [],
    },

    schedule: {
      days_available: {
        type: Number,
        default: 0,
      },
      days: {
        type: [
          {
            day: Number,
            focus: String,
            question_ids: [String],
            minutes: Number,
          },
        ],
        default: [],
      },
    },

    coverage: {
      uncovered_requirement_ids: {
        type: [String],
        default: [],
      },
      passes: {
        type: Number,
        default: 0,
      },
    },

    status: {
      type: String,
      enum: ["draft", "generating", "ready", "failed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export const Kit = mongoose.model<IKit>("Kit", kitSchema);