# Greenlight Market Report Agent: Live Search Data Blindspots & Synthesis Guardrails

This document outlines key areas where live web search returns incomplete, estimated, or unverified data across film market research domains. Use this guide to set expectations, refine prompt synthesis, and implement UI/UX caveats.

---

### 1. Financial & Box Office Data

* [ ] **Unreported Indie & Micro-Budget Production Costs**

  * **Query Type:** `"[Film Title]" production budget` or `"[Indie Film]" making cost`
  * **Why Data Fails:** Independent films under $5M rarely disclose budgets unless reported by trade outlets (e.g., *Deadline*, *Variety*) during festival sales or tax incentive filings.
  * **Synthesis Caveat:** *"Budget undisclosed — comparable indie films in this genre and scope typically range from $1M to $3M based on production scale."*
* [ ] **SVOD / Direct-to-Streaming Acquisition & Production Costs**

  * **Query Type:** `"[Streaming Title]" Netflix budget` or `"[Movie]" Apple TV acquiring price`
  * **Why Data Fails:** Streaming services consider financial terms proprietary trade secrets. Financial figures released online are typically unverified industry rumors or aggregated estimates.
  * **Synthesis Caveat:** *"Streaming production/acquisition costs are not publicly reported; estimates reflect industry trade reporting and talent package scale."*
* [ ] **PVOD (Digital Rental/Purchase) & Secondary Ancillary Revenues**

  * **Query Type:** `"[Film Title]" digital release earnings` or `"[Film Title]" VOD sales revenue`
  * **Why Data Fails:** Digital storefronts (Apple TV, Amazon Prime Video, Vudu) do not publish gross revenue reports comparable to theatrical box office numbers.
  * **Synthesis Caveat:** *"Digital/PVOD revenue is proprietary to platforms; performance is inferred via top-chart ranking placements rather than raw dollar amounts."*

---

### 2. Audience & Trend Data

* [ ] **Proprietary Streaming Viewership & Minutes Watched**

  * **Query Type:** `"[Streaming Film]" total viewers` or `"[Movie]" Netflix viewership numbers`
  * **Why Data Fails:** First-party platform metrics are selective, self-reported, and non-standardized. Third-party trackers (like Nielsen or Luminate) measure limited geographies (e.g., U.S. TV screens only) with a multi-week reporting lag.
  * **Synthesis Caveat:** *"Third-party viewership metrics reflect U.S. connected-TV viewing only; global multi-platform totals are undisclosed by the streamer."*
* [ ] **Granular Demographic Breakdown for Niche / Festival Releases**

  * **Query Type:** `"[Indie Film]" audience demographic age gender breakdown`
  * **Why Data Fails:** Exit polling services (e.g., CinemaScore, PostTrak) only survey wide theatrical releases (typically 1,500+ screens). Specialized or platform-released films lack standardized demographic polling.
  * **Synthesis Caveat:** *"Formal exit-poll demographics are unavailable for limited releases; audience profile is estimated based on genre baseline and festival attendance data."*
* [ ] **Early Social Media Sentiment & Pre-Release Hype Tracking**

  * **Query Type:** `"[Upcoming Film]" social media sentiment tracking` or `"[Pitch Concept]" audience demand`
  * **Why Data Fails:** Search APIs pull heavily noisy, astroturfed, or bot-inflated social data. Organic audience intent is easily distorted by targeted marketing campaigns or echo chambers before release.
  * **Synthesis Caveat:** *"Pre-release online sentiment reflects early promotional reach and fan community discussion, which may not translate directly to broad opening-weekend attendance."*

---

### 3. Competitor & Market Data

* [ ] **Development Pipeline & Unannounced Film Projects**

  * **Query Type:** `"movies in development about [specific niche concept]"`
  * **Why Data Fails:** Projects in early development or script phase exist behind paid industry databases (e.g., IMDbPro, StudioSystem) and are rarely indexed on the open web until options are officially announced in trade publications.
  * **Synthesis Caveat:** *"Competitive analysis is limited to publicly announced and active productions; unannounced projects in development are unindexed."*
* [ ] **Global Territorial Rights & Regional Distribution Deals**

  * **Query Type:** `"[Film Title]" international distribution rights buyers`
  * **Why Data Fails:** Film market sales (EFM, Cannes, AFM) yield fragmented territory-by-territory buyer listings that are rarely updated centrally online after the market closes.
  * **Synthesis Caveat:** *"International distribution breakdowns rely on partial trade announcements from film markets and may not reflect full worldwide rights coverage."*
* [ ] **Streaming Content Gaps & Library Expirations**

  * **Query Type:** `"underserved streaming demand for [specific subgenre]"`
  * **Why Data Fails:** Web search indexes present available titles, but cannot calculate missing consumer demand or quantify "unmet market desire" without proprietary platform search-query logs.
  * **Synthesis Caveat:** *"Market gaps are identified by analyzing low competitor supply against related genre trends, rather than direct platform search metrics."*

---

### 4. Empirical Test Pipeline Log

*Space reserved for logging live failures, edge cases, and thin-data responses during benchmark pitch execution.*

| Test Run ID | Pitch Title         | Category / Field        | Search Query Issued                              | Issue Description (e.g., Stale, Null, Fake)      | Applied Guardrail / Fallback Action                 |
| :---------- | :------------------ | :---------------------- | :----------------------------------------------- | :----------------------------------------------- | :-------------------------------------------------- |
| *#001*    | *Rustbelt Sonata* | *Financials / Budget* | *`"Rustbelt Sonata" film budget box office`* | *Returned 0 relevant hits (unproduced pitch).* | *Triggered indie genre fallback range ($1M-$3M).* |
| *#002*    |                     |                         |                                                  |                                                  |                                                     |
| *#003*    |                     |                         |                                                  |                                                  |                                                     |
| *#004*    |                     |                         |                                                  |                                                  |                                                     |
