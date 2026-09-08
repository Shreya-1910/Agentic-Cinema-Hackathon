# Financial Data Guardrails — Synthesis Prompt Spec

For Dev 2/B to implement in the synthesis prompt. Governs how the
model handles box office / budget figures pulled from live search.

## Rules

1. **State as-is** only when a figure is corroborated by a named 
   trade source (Variety, Deadline, THR, Box Office Mojo) — cite the source.
2. **Flag as approximate** when a figure appears only in aggregator 
   or unofficial sources — prefix with "approximately" and note the 
   uncertainty in the report.
3. **Never guess.** If search returns no financial data, the model 
   must explicitly state "no reliable data found" and fall back to a 
   genre/budget-tier range instead of inventing a number.

## Required phrasing patterns

- "Budget undisclosed — comparable [genre] films typically range from $X-Y."
- "Figures are approximate, based on unofficial industry reporting."
- "No reliable box office data available for direct comps in this budget tier."

## Effect on GREENLIGHT/PASS verdict

- Missing/approximate financial data does NOT block a verdict.
- It MUST lower stated confidence in the report (e.g. "Moderate confidence — 
  based on limited financial comps") rather than presenting the 
  recommendation as equally certain to a fully-sourced case.

## Edge case

- If comps have data but the pitch's own budget tier doesn't: state 
  the comps' figures normally, then explicitly flag that the current 
  pitch's own budget lacks a direct precedent at that specific tier.