# AI Interview Prep Kit

An AI-powered full-stack application that turns a job description and company website into a structured interview preparation kit.

## Features

- User registration and login
- Create interview kits from a job description
- Company research and website retrieval
- Requirement extraction with must/nice classification
- Categorized technical interview questions
- Flashcards
- Deterministic coverage checking
- Day-by-day study schedule
- Persistent MongoDB storage
- AI Interview Assistant
- Responsive Next.js interface
- Batch evaluation pipeline

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB / Mongoose
- JWT authentication
- Zod validation

### AI
- Google Gemini
- Model: `gemini-3.6-flash`

### Retrieval
- Axios
- Cheerio
- Website link discovery
- URL safety checks
- Robots.txt checks

## Architecture

```text
Next.js Frontend
       |
       v
Express API
       |
       +--> Authentication
       |
       +--> Kit Pipeline
       |      |
       |      +--> Requirement Extraction
       |      +--> Company Research
       |      +--> Company Brief
       |      +--> Question Generation
       |      +--> Coverage Check
       |      +--> Coverage Repair
       |      +--> Flashcards
       |      +--> Schedule Allocation
       |      +--> Validation
       |
       +--> MongoDB
       |
       +--> Gemini