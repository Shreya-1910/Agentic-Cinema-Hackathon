import { useState, useRef } from "react";

const FIXTURES = {
  greenlight: {
    verdict: "greenlight",
    confidence: "High",
    score: 78,
    project: "Untitled Sci-Fi Thriller",
    budget: "$30M",
    audience: "18–35",
    rationale:
      "Strong genre demand and a release-calendar gap in Q3 outweigh a crowded comp set.",
    competitors: [
      {
        title: "Aftershock",
        year: "2025",
        studio: "Legendary",
        boxOffice: "$142M",
        note: "Closest tonal comp",
      },
      {
        title: "The Drift",
        year: "2024",
        studio: "A24",
        boxOffice: "$61M",
        note: "Lower budget, similar premise",
      },
      {
        title: "Horizon Zero",
        year: "2025",
        studio: "Universal",
        boxOffice: "$208M",
        note: "Bigger scale, different tone",
      },
    ],
    trends: [
      "Original sci-fi thrillers are outperforming franchise entries with the 18–35 demo since early 2025.",
      "Streaming pre-sales for mid-budget thrillers have climbed for three consecutive quarters.",
      "Reviews reward practical effects and grounded tone over spectacle in this genre right now.",
    ],
    marketGap:
      "No major studio has a sci-fi thriller dated for Q3 next year. The two closest comps released 14+ months ago, leaving room before audience fatigue sets in.",
    risks: [
      {
        text: "Original IP without a built-in audience",
        severity: "amber",
      },
      {
        text: "Thriller pacing is hard to market in a 30-second trailer",
        severity: "amber",
      },
      {
        text: "Two competitors are already in production with overlapping premises",
        severity: "red",
      },
      {
        text: "Target demo's theatrical attendance has softened slightly year over year",
        severity: "amber",
      },
    ],
  },

  pass: {
    verdict: "pass",
    confidence: "Moderate",
    score: 34,
    project: "Untitled Sci-Fi Thriller",
    budget: "$30M",
    audience: "18–35",
    rationale:
      "Market is saturated for this exact premise, and none of the recent comps recouped budget theatrically.",
    competitors: [
      {
        title: "Aftershock",
        year: "2025",
        studio: "Legendary",
        boxOffice: "$142M",
        note: "Nearly identical premise",
      },
      {
        title: "Silent Orbit",
        year: "2025",
        studio: "Sony",
        boxOffice: "$38M",
        note: "Underperformed, similar budget",
      },
      {
        title: "The Drift",
        year: "2024",
        studio: "A24",
        boxOffice: "$61M",
        note: "Lower budget, similar premise",
      },
    ],
    trends: [
      "Four sci-fi thrillers with a near-identical logline have released in the past 18 months.",
      "Audience surveys show early fatigue signals for this specific subgenre.",
      "Reviews increasingly cite premise repetition as a criticism across the comp set.",
    ],
    marketGap:
      "No clear white space — three studios have released or announced adjacent projects in the same 12-month window.",
    risks: [
      {
        text: "Premise overlaps heavily with two recent releases",
        severity: "red",
      },
      {
        text: "Comp set shows a declining box office trend",
        severity: "red",
      },
      {
        text: "Subgenre fatigue signals in recent audience surveys",
        severity: "amber",
      },
    ],
  },
};

const STEPS = [
  "Searching competing films",
  "Analyzing box office comps",
  "Mapping audience trends",
  "Reading reviews",
  "Identifying market gaps",
  "Synthesizing report",
];

const VERDICT_COPY = {
  greenlight: {
    label: "Greenlit",
    color: "#607A50",
    seal: "✦",
  },
  caution: {
    label: "Proceed With Caution",
    color: "#B58A45",
    seal: "!",
  },
  pass: {
    label: "Pass",
    color: "#91483F",
    seal: "×",
  },
};

function FilmStrip({ position = "top" }) {
  return (
    <div
      style={{
        position: "absolute",
        [position]: 0,
        left: 0,
        right: 0,
        height: 18,
        overflow: "hidden",
        opacity: 0.22,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "100%",
          borderTop: "1px solid #6E5A45",
          borderBottom: "1px solid #6E5A45",
        }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              border: "1px solid #6E5A45",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "24px 0",
        color: "#A68A62",
        opacity: 0.8,
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background: "#C7B18D",
        }}
      />

      <span style={{ fontSize: 13 }}>✦</span>
      <span style={{ fontSize: 9 }}>◆</span>
      <span style={{ fontSize: 13 }}>✦</span>

      <span
        style={{
          flex: 1,
          height: 1,
          background: "#C7B18D",
        }}
      />
    </div>
  );
}

function VerdictSeal({ verdict }) {
  const info = VERDICT_COPY[verdict] || VERDICT_COPY.caution;

  return (
    <div
      style={{
        width: 104,
        height: 104,
        borderRadius: "50%",
        border: `2px solid ${info.color}`,
        outline: `1px solid ${info.color}`,
        outlineOffset: -7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: info.color,
        transform: "rotate(-7deg)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 20,
          lineHeight: 1,
        }}
      >
        {info.seal}
      </span>

      <span
        style={{
          marginTop: 5,
          fontFamily: "Georgia, serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "center",
          maxWidth: 75,
        }}
      >
        {info.label}
      </span>

      <span
        style={{
          marginTop: 3,
          fontSize: 7,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        Studio Review
      </span>
    </div>
  );
}

function RiskDot({ severity }) {
  const color =
    severity === "red"
      ? "#91483F"
      : severity === "amber"
        ? "#B58A45"
        : "#607A50";

  return (
    <span
      style={{
        display: "inline-block",
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: color,
        marginRight: 11,
        flexShrink: 0,
        marginTop: 7,
      }}
    />
  );
}

function SectionHeading({ eyebrow, children }) {
  return (
    <div style={{ marginBottom: 17 }}>
      {eyebrow && (
        <p
          style={{
            margin: "0 0 4px",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9B805C",
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </p>
      )}

      <h3
        style={{
          margin: 0,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 22,
          fontWeight: 600,
          color: "#382E27",
        }}
      >
        {children}
      </h3>
    </div>
  );
}

export default function GreenlightReport() {
  const [pitch, setPitch] = useState(
    "A $30M sci-fi thriller targeted at 18–35 year olds, set aboard a research vessel that loses contact with Earth."
  );

  const [phase, setPhase] = useState("form");
  const [visibleSteps, setVisibleSteps] = useState(0);

  // Real report returned by the backend
  const [reportData, setReportData] = useState(null);

  // Error returned by the backend
  const [error, setError] = useState(null);

  const timers = useRef([]);

  // ============================================================
  // CONNECT TO BACKEND
  // ============================================================

  const runResearch = async () => {
    // Clear any previous timers
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setPhase("researching");
    setVisibleSteps(0);
    setError(null);
    setReportData(null);

    // ----------------------------------------------------------
    // Animate the research steps while the backend is working
    // ----------------------------------------------------------

    STEPS.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleSteps(i + 1);
      }, (i + 1) * 550);

      timers.current.push(t);
    });

    try {
      console.log("[GREENLIGHT] Sending pitch to backend...");
      console.log("[GREENLIGHT] Pitch:", pitch);

      // --------------------------------------------------------
      // Call FastAPI
      // --------------------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/api/greenlight",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: pitch,
          }),
        }
      );

      console.log(
        "[GREENLIGHT] Backend status:",
        response.status
      );

      // --------------------------------------------------------
      // Handle HTTP errors
      // --------------------------------------------------------

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Backend returned HTTP ${response.status}`
        );
      }

      // --------------------------------------------------------
      // Get JSON report from FastAPI
      // --------------------------------------------------------

      const result = await response.json();

      console.log(
        "[GREENLIGHT] Real backend report:",
        result
      );

      // --------------------------------------------------------
      // Save real report
      // --------------------------------------------------------

      setReportData(result);

      // Make all research steps appear complete
      setVisibleSteps(STEPS.length);

      // Show report
      setPhase("report");
    } catch (err) {
      console.error(
        "[GREENLIGHT ERROR]",
        err
      );

      // Stop the animation timers
      timers.current.forEach(clearTimeout);
      timers.current = [];

      setError(
        err.message ||
          "Something went wrong while generating the report."
      );

      // Return to form so user can try again
      setPhase("form");
    }
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setPhase("form");
    setVisibleSteps(0);
    setReportData(null);
    setError(null);
  };

  // ------------------------------------------------------------
  // Use real backend data if available.
  // Fixtures are only a fallback before a real report exists.
  // ------------------------------------------------------------

  const data =
    reportData || FIXTURES.greenlight;

  const verdict =
    VERDICT_COPY[data.verdict] ||
    VERDICT_COPY.caution;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 10%, rgba(183,145,91,0.10), transparent 25%), #E8DDC8",
        color: "#382E27",
        fontFamily: "'Trebuchet MS', Arial, sans-serif",
        padding: "48px 20px 70px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FilmStrip position="top" />

      {/* subtle paper texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage:
            "radial-gradient(#5D4C3B 0.6px, transparent 0.6px)",
          backgroundSize: "5px 5px",
        }}
      />

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* ====================================================
            FORM
        ==================================================== */}

        {phase === "form" && (
          <div>
            {/* Masthead */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 44,
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#927653",
                  fontWeight: 700,
                }}
              >
                ✦ The Picture Desk ✦
              </p>

              <h1
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize: 48,
                  lineHeight: 1.05,
                  fontWeight: 500,
                  margin: 0,
                  color: "#382E27",
                  letterSpacing: "-0.025em",
                }}
              >
                Greenlight
                <br />
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#7E403A",
                  }}
                >
                  Report
                </span>
              </h1>

              <OrnamentalDivider />

              <p
                style={{
                  maxWidth: 460,
                  margin: "0 auto",
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#776653",
                }}
              >
                A little intelligence for deciding
                which stories deserve their moment in the
                spotlight.
              </p>
            </div>

            {/* Main paper */}
            <div
              style={{
                background: "#F5EBD8",
                border: "1px solid #C9B99D",
                boxShadow:
                  "0 12px 35px rgba(76, 57, 37, 0.13)",
                padding: "34px 38px 38px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: 12,
                  border:
                    "1px solid rgba(158,127,87,0.25)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <label
                    htmlFor="pitch"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#80684D",
                    }}
                  >
                    Prompt
                  </label>
                </div>

                <textarea
                  id="pitch"
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  rows={5}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#FBF4E6",
                    border: "1px solid #CBB99B",
                    borderRadius: 2,
                    color: "#40352B",
                    padding: "17px 18px",
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                    fontSize: 16,
                    lineHeight: 1.65,
                    resize: "vertical",
                    outline: "none",
                    boxShadow:
                      "inset 0 2px 5px rgba(86,65,43,0.05)",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 23,
                  }}
                >
                  <button
                    onClick={runResearch}
                    disabled={!pitch.trim()}
                    style={{
                      background: "#7E403A",
                      color: "#FFF7E8",
                      border: "none",
                      borderRadius: 2,
                      padding: "13px 24px",
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: 14,
                      cursor: pitch.trim()
                        ? "pointer"
                        : "not-allowed",
                      letterSpacing: "0.04em",
                      boxShadow:
                        "0 4px 10px rgba(91,49,44,0.18)",
                      opacity: pitch.trim() ? 1 : 0.6,
                    }}
                  >
                    Begin the screening
                  </button>
                </div>

                {/* Backend error */}
                {error && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: "13px 15px",
                      background: "#F3E0D7",
                      border: "1px solid #C99B8D",
                      color: "#91483F",
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Screening failed:</strong>{" "}
                    {error}
                  </div>
                )}
              </div>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: 25,
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontSize: 11,
                color: "#9B8569",
                fontStyle: "italic",
              }}
            ></p>
          </div>
        )}

        {/* ====================================================
            RESEARCHING
        ==================================================== */}

        {phase === "researching" && (
          <div
            style={{
              maxWidth: 580,
              margin: "90px auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 34,
                color: "#7E403A",
                marginBottom: 15,
              }}
            >
              ✦
            </div>

            <h2
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                fontSize: 30,
                margin: 0,
                color: "#382E27",
              }}
            >
              The projector is rolling...
            </h2>

            <p
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                color: "#8B755C",
                margin: "8px 0 30px",
                fontSize: 14,
              }}
            >
              Consulting the archives
            </p>

            <div
              style={{
                background: "#F5EBD8",
                border: "1px solid #C9B99D",
                padding: "24px 30px",
                textAlign: "left",
                boxShadow:
                  "0 10px 28px rgba(76,57,37,0.10)",
              }}
            >
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    padding: "11px 0",
                    opacity: i < visibleSteps ? 1 : 0.28,
                    transition: "opacity 0.4s ease",
                    borderBottom:
                      i !== STEPS.length - 1
                        ? "1px dotted #C8B79A"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: "1px solid #A88D69",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      color:
                        i < visibleSteps
                          ? "#7E403A"
                          : "#A4937B",
                      flexShrink: 0,
                    }}
                  >
                    {i < visibleSteps ? "✓" : "○"}
                  </span>

                  <span
                    style={{
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: 15,
                      color:
                        i < visibleSteps
                          ? "#493C30"
                          : "#9A896F",
                    }}
                  >
                    {step}
                  </span>

                  {i < visibleSteps && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 9,
                        color: "#607A50",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      done
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            REPORT
        ==================================================== */}

        {phase === "report" && (
          <div>
            {/* Report masthead */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#967A58",
                  fontWeight: 700,
                }}
              >
                Confidential · Studio Research Desk
              </p>

              <h1
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize: 37,
                  fontWeight: 500,
                  margin: "8px 0 0",
                  color: "#382E27",
                }}
              >
                The Greenlight agent
              </h1>

              <p
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  color: "#90775A",
                  fontSize: 12,
                  margin: "6px 0 0",
                }}
              >
                Market intelligence
              </p>
            </div>

            {/* Report paper */}
            <div
              style={{
                background: "#F5EBD8",
                border: "1px solid #C9B99D",
                boxShadow:
                  "0 15px 40px rgba(76,57,37,0.14)",
                padding: "38px 42px 42px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 13,
                  left: 13,
                  right: 13,
                  bottom: 13,
                  border:
                    "1px solid rgba(158,127,87,0.22)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative" }}>
                {/* Verdict */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 25,
                    paddingBottom: 25,
                  }}
                >
                  <VerdictSeal verdict={data.verdict} />

                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 9,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "#927653",
                        fontWeight: 700,
                      }}
                    >
                      Final recommendation
                    </p>

                    <h2
                      style={{
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 30,
                        fontWeight: 500,
                        color: verdict.color,
                        margin: 0,
                      }}
                    >
                      {verdict.label}
                    </h2>

                    <p
                      style={{
                        margin: "7px 0 0",
                        color: "#6F604F",
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 14,
                        lineHeight: 1.55,
                        maxWidth: 450,
                      }}
                    >
                      {data.rationale}
                    </p>
                  </div>
                </div>

                <OrnamentalDivider />

                {/* Project information */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: 18,
                    padding: "3px 0 10px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "#967A58",
                        fontWeight: 700,
                      }}
                    >
                      Prompt
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 15,
                        color: "#40352B",
                      }}
                    >
                      {data.project}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "#967A58",
                        fontWeight: 700,
                      }}
                    >
                      Opportunity
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 25,
                        color: "#382E27",
                      }}
                    >
                      {data.score}

                      <span
                        style={{
                          fontSize: 12,
                          color: "#927D63",
                        }}
                      >
                        {" "}
                        / 100
                      </span>
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "#967A58",
                        fontWeight: 700,
                      }}
                    >
                      Confidence
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 15,
                        color: "#40352B",
                      }}
                    >
                      {data.confidence}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "#967A58",
                        fontWeight: 700,
                      }}
                    >
                      Audience
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 15,
                        color: "#40352B",
                      }}
                    >
                      {data.audience}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "#967A58",
                        fontWeight: 700,
                      }}
                    >
                      Budget
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 15,
                        color: "#40352B",
                      }}
                    >
                      {data.budget}
                    </p>
                  </div>
                </div>

                <OrnamentalDivider />

                {/* Competitors */}
                <section style={{ padding: "3px 0" }}>
                  <SectionHeading eyebrow="The competition">
                    Major competitors
                  </SectionHeading>

                  <div
                    style={{
                      borderTop: "1px solid #BFAE91",
                    }}
                  >
                    {data.competitors.map((c, i) => (
                      <div
                        key={c.title}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "35px 1fr auto",
                          gap: 13,
                          alignItems: "center",
                          padding: "15px 4px",
                          borderBottom:
                            "1px dotted #C6B59A",
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            fontSize: 13,
                            color: "#A38A68",
                          }}
                        >
                          0{i + 1}
                        </span>

                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",
                              fontSize: 16,
                              color: "#40352B",
                            }}
                          >
                            {c.title}
                          </p>

                          <p
                            style={{
                              margin: "3px 0 0",
                              fontSize: 11,
                              color: "#89745B",
                            }}
                          >
                            {c.studio}, {c.year} · {c.note}
                          </p>
                        </div>

                        <p
                          style={{
                            margin: 0,
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            fontSize: 15,
                            color: "#6E443D",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.boxOffice}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <OrnamentalDivider />

                {/* Trends */}
                <section>
                  <SectionHeading eyebrow="The word on the street">
                    Observed trends
                  </SectionHeading>

                  {data.trends.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 13,
                        marginBottom: 14,
                      }}
                    >
                      <span
                        style={{
                          color: "#9C7A4F",
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 15,
                        }}
                      >
                        ✦
                      </span>

                      <p
                        style={{
                          margin: 0,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: "#655747",
                        }}
                      >
                        {t}
                      </p>
                    </div>
                  ))}
                </section>

                <OrnamentalDivider />

                {/* Market gap */}
                <section
                  style={{
                    background: "#E8DDC8",
                    border: "1px solid #C7B493",
                    padding: "22px 24px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: -11,
                      left: 22,
                      background: "#F5EBD8",
                      padding: "0 9px",
                      color: "#967A58",
                      fontSize: 10,
                    }}
                  >
                    ✦
                  </span>

                  <SectionHeading eyebrow="White space">
                    The market gap
                  </SectionHeading>

                  <p
                    style={{
                      margin: 0,
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#5D4E40",
                    }}
                  >
                    {data.marketGap}
                  </p>
                </section>

                <OrnamentalDivider />

                {/* Risks */}
                <section>
                  <SectionHeading eyebrow="Proceed thoughtfully">
                    Risks & watch-outs
                  </SectionHeading>

                  {data.risks.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: 12,
                        paddingBottom: 12,
                        borderBottom:
                          i !== data.risks.length - 1
                            ? "1px dotted #C9B99D"
                            : "none",
                      }}
                    >
                      <RiskDot severity={r.severity} />

                      <p
                        style={{
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 14,
                          color: "#655747",
                          margin: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        {r.text}
                      </p>

                      <span
                        style={{
                          marginLeft: "auto",
                          paddingLeft: 12,
                          fontSize: 8,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color:
                            r.severity === "red"
                              ? "#91483F"
                              : "#B58A45",
                        }}
                      >
                        {r.severity}
                      </span>
                    </div>
                  ))}
                </section>

                {/* Footer */}
                <div
                  style={{
                    marginTop: 30,
                    paddingTop: 20,
                    borderTop: "1px solid #BFAE91",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: 11,
                      color: "#927A5D",
                      fontStyle: "italic",
                    }}
                  >
                    End of report ·
                  </p>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: "#A48A67",
                      letterSpacing: "0.2em",
                    }}
                  >
                    ✦ · ✦ · ✦
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div
              style={{
                textAlign: "center",
                marginTop: 25,
              }}
            >
              <button
                onClick={reset}
                style={{
                  background: "transparent",
                  border: "1px solid #A99376",
                  color: "#705D48",
                  padding: "10px 20px",
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize: 12,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                ↩ Review another picture
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}