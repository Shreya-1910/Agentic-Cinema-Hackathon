# Greenlight Report - AI Powered Movies Pitch Market Research Agent 
## Built for the Agentic Cinema Hackathon - Parallel Track

## What it Does 

A producer describes a film pitch in plain language (genre, budget, target audience). The agent researches the live market - competing films, box office performance, audience trends, critical reception, and market gaps by using Parallel's Search API. It then synthesises everything into a structured Greenlight Report: a verdict (Greenlight or Pass), a confidence score, name comps with sources, risks and a final recommendation.

This turns a research process that would normally take a studio analyst hours or days into a single request, with every claim traceable to a real source.

## Why This Matters

Early pitch evaluation usually starts with a manual pass: pulling up a handful of comps, checking box office numbers, skimming reviews. It's not that this research doesn't happen — the only problem being that it's slow, inconsistent between people, and easy to skip steps under time pressure. Generic AI chat tools can speed up the writing, but they tend to produce confident-sounding summaries without checking their own facts, which is exactly the wrong failure mode for something meant to inform a real financial decision. This agent doesn't replace a producer's judgment or a full market analysis — it's a first-pass research assistant. It runs the same kind of live lookups a person would (competitors, box office, reviews, trends, gaps), and its instructions require every claim in the output to trace back to an actual source it retrieved during that run, not to invent or remember figures. That doesn't make the output infallible — web data is noisy and sources can disagree — but it's a defensible starting point, and fast enough to run before a meeting in order to enhance further discussion and move projects forward.

## Architecture

```
Producer enters a pitch (web UI)
        ↓
Gemini agent (Google Cloud Agent Runtime / ADK)
        ↓ (agent decides which tools to call)
5 research tools, each a distinct Parallel Search API call:
  • find_competing_films
  • box_office_search
  • audience_trends_search
  • review_sentiment_search
  • market_gap_search
        ↓
Gemini synthesizes all tool outputs into one structured JSON report
        ↓
Report rendered in the web UI (score, verdict, competitors table,
trends, risks, recommendation, sources)
```

## Tech Stack 
- Google Cloud Agent Runtime / Agent Development Kit (ADK)- orchestration and deployment
- Gemini 2.5 Flash - reasoning and synthesis
- Parallel Search API - live web research ( 5 distinct tools calls per report)
- React + Vite + Tailwind - frontend
- Python - backend agent logic 

## How Parallel is used

The agent calls Parallel's Search API through 5 distinct tool functions, each targeting a different research area (competitors, box office, audience trends, review sentiment, market gaps). This isn't a single token call — every report triggers multiple live, distinct Parallel searches, and the agent's instructions explicitly require it to ground every fact in the actual search results it receives, never in its own training knowledge. See ```backend/agents/my-agent/app/agent.py``` for the tool definitions and the full synthesis instruction.

## Report Schema

Ever report follows a consistent JSON structure:

```json
{
  "pitch_summary": "",
  "verdict": "GREENLIGHT | PASS",
  "score": 0,
  "competitors": [
    { "title": "", "release_year": null, "similarity_reason": "", "box_office": "", "source_url": "" }
  ],
  "audience_trends": { "summary": "", "supporting_points": [], "source_urls": [] },
  "review_sentiment": { "summary": "", "sentiment_score": "", "source_urls": [] },
  "market_gap": { "gap": "", "source_urls": [] },
  "risks": [ { "risk": "", "reasoning": "" } ],
  "recommendation": "",
  "sources": []
}
```

Every claim in the report (every competitor, every trend, every risk), is required by the agent's instructions to trace back to a real URL returned by a Parallel search during that specific run .

## Setup & Running Locally 

### Prerequisites 
- Python 3.12+
- google CLoud project with Vertex AI enabled
- Parallel API key (platform.paralle.ai)
- ```google-agents-cli``` installed (```pip install google-agents-cli``` or ```uv tool install google-agents-cli```)

### Backend (Agent)

```bash
cd backend/agents/my-agent
# Create a .env file with:
#   PARALLEL_API_KEY=your_key_here
#   GOOGLE_GENAI_USE_VERTEXAI=true
#   GOOGLE_CLOUD_PROJECT=your-project-id
#   GOOGLE_CLOUD_LOCATION=us-central1

pip install -r requirements.txt
agents-cli run "your test pitch here"      # test locally
agents-cli deploy --project your-project-id # deploy to Agent Runtime
```

### Frontend 

```bash
cd frontend
npm install
npm run dev
```

## Demo

## Live Project 
https://cinemahackathon.vercel.app
## Repository

## License 
This project is licensed under the MIT License — see the LICENSE file for details.




   
