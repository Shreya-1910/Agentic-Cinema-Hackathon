# Live Progress-List Copy

UI copy shown while the agent runs its 5-step research pipeline.
Owned by Dev 4, implemented by Dev 3 in the frontend progress component.

| Step | In-progress | Complete |
|---|---|---|
| Competing films | Searching competing films... | Found 6 competing titles |
| Box office comps | Analyzing box office comps... | Pulled comps from 4 sources |
| Audience trends | Checking audience trends... | Mapped audience demand signals |
| Review sentiment | Scanning review sentiment... | Analyzed sentiment across 12 reviews |
| Market gaps | Identifying market gaps... | Found 3 underserved niches |

Notes:
- "Complete" lines are placeholder counts — once the real pipeline runs (Phase 3), 
  replace static numbers with actual dynamic values returned by each tool.
- Confirm final step count/order with Dev 3 before hardcoding into UI — may 
  shift if steps get combined or Extract API is added as a 6th step.