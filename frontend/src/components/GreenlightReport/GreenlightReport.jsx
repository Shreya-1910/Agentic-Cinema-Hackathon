import { useState, useRef } from "react";
import { addAppLog } from "../../utils/appLogs";

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
    label: "Failed",
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
  const info =
    VERDICT_COPY[verdict] || VERDICT_COPY.caution;

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

// ============================================================
// HELPERS
// ============================================================

function normalizeVerdict(verdict, score) {
  // The backend research score is the source of truth.
  // 50 and above = Greenlit
  // Below 50 = Failed
  if (
    typeof score === "number" &&
    !Number.isNaN(score)
  ) {
    return score >= 50
      ? "greenlight"
      : "pass";
  }

  // Fallback only if no valid score is returned.
  const value = String(verdict || "").toLowerCase();

  if (
    value === "greenlight" ||
    value === "greenlit"
  ) {
    return "greenlight";
  }

  if (
    value === "pass" ||
    value === "failed"
  ) {
    return "pass";
  }

  return "caution";
}

function extractBudget(text) {
  if (!text) return "Not specified";

  const match = text.match(
    /\$[\d,.]+\s?(?:M|B|K)?/i
  );

  return match ? match[0] : "Not specified";
}

function extractAudience(text) {
  if (!text) return "Not specified";

  const match = text.match(
    /\d+\s*[–-]\s*\d+/
  );

  return match ? match[0] : "Not specified";
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function GreenlightReport() {
  const [pitch, setPitch] = useState(
    "A $30M sci-fi thriller targeted at 18–35 year olds, set aboard a research vessel that loses contact with Earth."
  );

  const [phase, setPhase] = useState("form");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const timers = useRef([]);

  // ============================================================
  // RUN BACKEND RESEARCH
  // ============================================================

  const runResearch = async () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setPhase("researching");
    setVisibleSteps(0);
    setError(null);
    setReportData(null);

    // Animate research steps
    STEPS.forEach((_, i) => {
      const timer = setTimeout(() => {
        setVisibleSteps(i + 1);
      }, (i + 1) * 550);

      timers.current.push(timer);
    });

    try {
      console.log(
        "[GREENLIGHT] Sending pitch to backend..."
      );

      console.log(
        "[GREENLIGHT] Pitch:",
        pitch
      );

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

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Backend returned HTTP ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        "[GREENLIGHT] REAL BACKEND JSON:",
        result
      );

      // IMPORTANT:
      // Save the EXACT backend JSON.
      setReportData(result);

      setVisibleSteps(STEPS.length);

      // Show report
      setPhase("report");
    } catch (err) {
      console.error(
        "[GREENLIGHT ERROR]",
        err
      );

      timers.current.forEach(clearTimeout);
      timers.current = [];

      setError(
        err.message ||
          "Something went wrong while generating the report."
      );

      setPhase("form");
    }
  };

  // ============================================================
  // RESET
  // ============================================================

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setPhase("form");
    setVisibleSteps(0);
    setReportData(null);
    setError(null);
  };

  // ============================================================
  // DATA FROM BACKEND
  // ============================================================

  const data = reportData
    ? {
        // SCORE NOW DETERMINES THE VERDICT
        verdict: normalizeVerdict(
          reportData.verdict,
          reportData.score
        ),

        score:
          typeof reportData.score === "number"
            ? reportData.score
            : 0,

        pitchSummary:
          reportData.pitch_summary ||
          pitch,

        budget: extractBudget(
          reportData.pitch_summary || pitch
        ),

        audience: extractAudience(
          reportData.pitch_summary || pitch
        ),

        competitors:
          Array.isArray(
            reportData.competitors
          )
            ? reportData.competitors
            : [],

        audienceTrends:
          reportData.audience_trends || {},

        reviewSentiment:
          reportData.review_sentiment || {},

        marketGap:
          reportData.market_gap || {},

        risks:
          Array.isArray(reportData.risks)
            ? reportData.risks
            : [],

        recommendation:
          reportData.recommendation ||
          "No recommendation was returned.",

        sources:
          Array.isArray(reportData.sources)
            ? reportData.sources
            : [],
      }
    : null;

  const verdictInfo =
    VERDICT_COPY[data?.verdict] ||
    VERDICT_COPY.caution;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 10%, rgba(183,145,91,0.10), transparent 25%), #E8DDC8",
        color: "#382E27",
        fontFamily:
          "'Trebuchet MS', Arial, sans-serif",
        padding: "48px 20px 70px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FilmStrip position="top" />

      {/* Paper texture */}
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
          maxWidth: 820,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* ====================================================
            FORM
        ==================================================== */}

        {phase === "form" && (
          <div>
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
                which stories deserve their moment
                in the spotlight.
              </p>
            </div>

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

              <div
                style={{
                  position: "relative",
                }}
              >
                <label
                  htmlFor="pitch"
                  style={{
                    display: "block",
                    marginBottom: 12,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#80684D",
                  }}
                >
                  Prompt
                </label>

                <textarea
                  id="pitch"
                  value={pitch}
                  onChange={(e) =>
                    setPitch(e.target.value)
                  }
                  rows={5}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#FBF4E6",
                    border:
                      "1px solid #CBB99B",
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

                <button
                  onClick={runResearch}
                  disabled={!pitch.trim()}
                  style={{
                    marginTop: 23,
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
                    opacity: pitch.trim()
                      ? 1
                      : 0.6,
                  }}
                >
                  Begin the screening
                </button>

                {error && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: "13px 15px",
                      background: "#F3E0D7",
                      border:
                        "1px solid #C99B8D",
                      color: "#91483F",
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>
                      Screening failed:
                    </strong>{" "}
                    {error}
                  </div>
                )}
              </div>
            </div>
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
                margin:
                  "8px 0 30px",
                fontSize: 14,
              }}
            >
              Consulting the archives
            </p>

            <div
              style={{
                background: "#F5EBD8",
                border:
                  "1px solid #C9B99D",
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
                    opacity:
                      i < visibleSteps
                        ? 1
                        : 0.28,
                    transition:
                      "opacity 0.4s ease",
                    borderBottom:
                      i !==
                      STEPS.length - 1
                        ? "1px dotted #C8B79A"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border:
                        "1px solid #A88D69",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      fontSize: 9,
                      color:
                        i < visibleSteps
                          ? "#7E403A"
                          : "#A4937B",
                      flexShrink: 0,
                    }}
                  >
                    {i < visibleSteps
                      ? "✓"
                      : "○"}
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

                  {i <
                    visibleSteps && (
                    <span
                      style={{
                        marginLeft:
                          "auto",
                        fontSize: 9,
                        color: "#607A50",
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.1em",
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

        {phase === "report" &&
          data && (
            <div>
              {/* Header */}
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
                    letterSpacing:
                      "0.25em",
                    textTransform:
                      "uppercase",
                    color: "#967A58",
                    fontWeight: 700,
                  }}
                >
                  Confidential · Studio
                  Research Desk
                </p>

                <h1
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                    fontSize: 37,
                    fontWeight: 500,
                    margin:
                      "8px 0 0",
                    color: "#382E27",
                  }}
                >
                  The Greenlight Agent
                </h1>

                <p
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    color: "#90775A",
                    fontSize: 12,
                    margin:
                      "6px 0 0",
                  }}
                >
                  Market intelligence ·
                  Agent-generated
                </p>
              </div>

              {/* Paper */}
              <div
                style={{
                  background: "#F5EBD8",
                  border:
                    "1px solid #C9B99D",
                  boxShadow:
                    "0 15px 40px rgba(76,57,37,0.14)",
                  padding:
                    "38px 42px 42px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position:
                      "absolute",
                    top: 13,
                    left: 13,
                    right: 13,
                    bottom: 13,
                    border:
                      "1px solid rgba(158,127,87,0.22)",
                    pointerEvents:
                      "none",
                  }}
                />

                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  {/* ==================================================
                      VERDICT
                  ================================================== */}

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 25,
                      paddingBottom: 25,
                    }}
                  >
                    <VerdictSeal
                      verdict={
                        data.verdict
                      }
                    />

                    <div>
                      <p
                        style={{
                          margin:
                            "0 0 5px",
                          fontSize: 9,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.2em",
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
                          color:
                            verdictInfo.color,
                          margin: 0,
                        }}
                      >
                        {
                          verdictInfo.label
                        }
                      </h2>

                      <p
                        style={{
                          margin:
                            "7px 0 0",
                          color: "#6F604F",
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 14,
                          lineHeight: 1.55,
                          maxWidth: 500,
                        }}
                      >
                        {
                          data.recommendation
                        }
                      </p>
                    </div>
                  </div>

                  <OrnamentalDivider />

                  {/* ==================================================
                      PITCH SUMMARY
                  ================================================== */}

                  <section>
                    <SectionHeading eyebrow="The project">
                      Pitch summary
                    </SectionHeading>

                    <div
                      style={{
                        background:
                          "#EFE3CF",
                        border:
                          "1px solid #C7B493",
                        padding:
                          "20px 22px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 16,
                          lineHeight: 1.7,
                          color:
                            "#5D4E40",
                        }}
                      >
                        {
                          data.pitchSummary
                        }
                      </p>
                    </div>
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      SCORE / AUDIENCE / BUDGET
                  ================================================== */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 18,
                    }}
                  >
                    <div
                      style={{
                        background:
                          "#E8DDC8",
                        border:
                          "1px solid #C7B493",
                        padding:
                          "18px 20px",
                      }}
                    >
                      <p
                        style={{
                          margin:
                            "0 0 6px",
                          fontSize: 8,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.16em",
                          color:
                            "#967A58",
                          fontWeight: 700,
                        }}
                      >
                        Opportunity score
                      </p>

                      <p
                        style={{
                          margin: 0,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 30,
                          color:
                            "#382E27",
                        }}
                      >
                        {data.score}
                        <span
                          style={{
                            fontSize: 12,
                            color:
                              "#927D63",
                          }}
                        >
                          {" "}
                          / 100
                        </span>
                      </p>
                    </div>

                    <div
                      style={{
                        background:
                          "#E8DDC8",
                        border:
                          "1px solid #C7B493",
                        padding:
                          "18px 20px",
                      }}
                    >
                      <p
                        style={{
                          margin:
                            "0 0 6px",
                          fontSize: 8,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.16em",
                          color:
                            "#967A58",
                          fontWeight: 700,
                        }}
                      >
                        Target audience
                      </p>

                      <p
                        style={{
                          margin: 0,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 18,
                          color:
                            "#382E27",
                        }}
                      >
                        {
                          data.audience
                        }
                      </p>
                    </div>

                    <div
                      style={{
                        background:
                          "#E8DDC8",
                        border:
                          "1px solid #C7B493",
                        padding:
                          "18px 20px",
                      }}
                    >
                      <p
                        style={{
                          margin:
                            "0 0 6px",
                          fontSize: 8,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.16em",
                          color:
                            "#967A58",
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
                          fontSize: 18,
                          color:
                            "#382E27",
                        }}
                      >
                        {data.budget}
                      </p>
                    </div>
                  </div>

                  <OrnamentalDivider />

                  {/* ==================================================
                      COMPETITORS
                  ================================================== */}

                  <section>
                    <SectionHeading eyebrow="The competition">
                      Major competitors
                    </SectionHeading>

                    {data.competitors.length ===
                    0 ? (
                      <p
                        style={{
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          color:
                            "#806F5B",
                          fontSize: 14,
                        }}
                      >
                        No competitor
                        data returned.
                      </p>
                    ) : (
                      <div
                        style={{
                          borderTop:
                            "1px solid #BFAE91",
                        }}
                      >
                        {data.competitors.map(
                          (film, index) => (
                            <div
                              key={
                                film.title ||
                                index
                              }
                              style={{
                                padding:
                                  "18px 4px",
                                borderBottom:
                                  "1px dotted #C6B59A",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: 20,
                                }}
                              >
                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontFamily:
                                        "Georgia, 'Times New Roman', serif",
                                      fontSize: 18,
                                      color:
                                        "#40352B",
                                    }}
                                  >
                                    {String(
                                      index +
                                        1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}{" "}
                                    ·{" "}
                                    {
                                      film.title
                                    }
                                  </p>

                                  <p
                                    style={{
                                      margin:
                                        "5px 0 0",
                                      fontSize:
                                        11,
                                      color:
                                        "#89745B",
                                    }}
                                  >
                                    Released{" "}
                                    {
                                      film.release_year
                                    }
                                  </p>
                                </div>

                                <div
                                  style={{
                                    fontFamily:
                                      "Georgia, 'Times New Roman', serif",
                                    fontSize:
                                      12,
                                    color:
                                      "#6E443D",
                                    textAlign:
                                      "right",
                                    maxWidth:
                                      250,
                                  }}
                                >
                                  {
                                    film.box_office
                                  }
                                </div>
                              </div>

                              <p
                                style={{
                                  margin:
                                    "10px 0 0",
                                  fontFamily:
                                    "Georgia, 'Times New Roman', serif",
                                  fontSize:
                                    13,
                                  lineHeight:
                                    1.6,
                                  color:
                                    "#655747",
                                }}
                              >
                                {
                                  film.similarity_reason
                                }
                              </p>

                              {film.source_url && (
                                <a
                                  href={
                                    film.source_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display:
                                      "inline-block",
                                    marginTop:
                                      8,
                                    fontSize:
                                      10,
                                    color:
                                      "#7E403A",
                                    textDecoration:
                                      "none",
                                  }}
                                >
                                  View source →
                                </a>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      AUDIENCE TRENDS
                  ================================================== */}

                  <section>
                    <SectionHeading eyebrow="Audience intelligence">
                      Audience trends
                    </SectionHeading>

                    {data.audienceTrends
                      .summary && (
                      <p
                        style={{
                          margin:
                            "0 0 18px",
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontStyle:
                            "italic",
                          fontSize: 14,
                          lineHeight:
                            1.7,
                          color:
                            "#655747",
                        }}
                      >
                        {
                          data
                            .audienceTrends
                            .summary
                        }
                      </p>
                    )}

                    {Array.isArray(
                      data.audienceTrends
                        .supporting_points
                    ) &&
                      data.audienceTrends.supporting_points.map(
                        (point, index) => (
                          <div
                            key={index}
                            style={{
                              display:
                                "flex",
                              gap: 13,
                              marginBottom:
                                14,
                            }}
                          >
                            <span
                              style={{
                                color:
                                  "#9C7A4F",
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",
                                fontSize:
                                  15,
                              }}
                            >
                              ✦
                            </span>

                            <p
                              style={{
                                margin: 0,
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",
                                fontSize:
                                  14,
                                lineHeight:
                                  1.65,
                                color:
                                  "#655747",
                              }}
                            >
                              {point}
                            </p>
                          </div>
                        )
                      )}
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      REVIEW SENTIMENT
                  ================================================== */}

                  <section
                    style={{
                      background:
                        "#EFE3CF",
                      border:
                        "1px solid #C7B493",
                      padding:
                        "22px 24px",
                    }}
                  >
                    <SectionHeading eyebrow="Critical reception">
                      Review sentiment
                    </SectionHeading>

                    {data.reviewSentiment
                      .sentiment_score && (
                      <div
                        style={{
                          display:
                            "inline-block",
                          background:
                            "#E8DDC8",
                          border:
                            "1px solid #BFAE91",
                          padding:
                            "8px 13px",
                          marginBottom:
                            15,
                          fontSize: 11,
                          fontWeight: 700,
                          color:
                            "#7E403A",
                          letterSpacing:
                            "0.05em",
                        }}
                      >
                        {
                          data
                            .reviewSentiment
                            .sentiment_score
                        }
                      </div>
                    )}

                    {data.reviewSentiment
                      .summary && (
                      <p
                        style={{
                          margin: 0,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 14,
                          lineHeight:
                            1.7,
                          color:
                            "#5D4E40",
                        }}
                      >
                        {
                          data
                            .reviewSentiment
                            .summary
                        }
                      </p>
                    )}
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      MARKET GAP
                  ================================================== */}

                  <section
                    style={{
                      background:
                        "#E8DDC8",
                      border:
                        "1px solid #C7B493",
                      padding:
                        "22px 24px",
                    }}
                  >
                    <SectionHeading eyebrow="White space">
                      The market gap
                    </SectionHeading>

                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 15,
                        lineHeight:
                          1.7,
                        color:
                          "#5D4E40",
                      }}
                    >
                      {
                        data.marketGap
                          .gap
                      }
                    </p>

                    {Array.isArray(
                      data.marketGap
                        .source_urls
                    ) &&
                      data.marketGap.source_urls
                        .length > 0 && (
                        <div
                          style={{
                            marginTop:
                              15,
                            paddingTop:
                              12,
                            borderTop:
                              "1px dotted #BFAE91",
                          }}
                        >
                          <p
                            style={{
                              margin:
                                "0 0 8px",
                              fontSize:
                                9,
                              textTransform:
                                "uppercase",
                              letterSpacing:
                                "0.15em",
                              color:
                                "#967A58",
                              fontWeight:
                                700,
                            }}
                          >
                            Sources
                          </p>

                          {data.marketGap.source_urls.map(
                            (
                              url,
                              index
                            ) => (
                              <a
                                key={
                                  index
                                }
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    11,
                                  color:
                                    "#7E403A",
                                  textDecoration:
                                    "none",
                                  marginBottom:
                                    5,
                                  wordBreak:
                                    "break-all",
                                }}
                              >
                                {url}
                              </a>
                            )
                          )}
                        </div>
                      )}
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      RISKS
                  ================================================== */}

                  <section>
                    <SectionHeading eyebrow="Proceed thoughtfully">
                      Risks & watch-outs
                    </SectionHeading>

                    {data.risks.length ===
                    0 ? (
                      <p
                        style={{
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          color:
                            "#806F5B",
                          fontSize: 14,
                        }}
                      >
                        No specific risks
                        were returned.
                      </p>
                    ) : (
                      data.risks.map(
                        (risk, index) => (
                          <div
                            key={index}
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "flex-start",
                              marginBottom:
                                14,
                              paddingBottom:
                                14,
                              borderBottom:
                                index !==
                                data.risks
                                  .length -
                                  1
                                  ? "1px dotted #C9B99D"
                                  : "none",
                            }}
                          >
                            <RiskDot
                              severity={
                                risk.severity
                              }
                            />

                            <div
                              style={{
                                flex: 1,
                              }}
                            >
                              <p
                                style={{
                                  fontFamily:
                                    "Georgia, 'Times New Roman', serif",
                                  fontSize:
                                    14,
                                  color:
                                    "#655747",
                                  margin: 0,
                                  lineHeight:
                                    1.55,
                                  fontWeight:
                                    600,
                                }}
                              >
                                {
                                  risk.risk
                                }
                              </p>

                              <p
                                style={{
                                  margin:
                                    "5px 0 0",
                                  fontFamily:
                                    "Georgia, 'Times New Roman', serif",
                                  fontSize:
                                    12,
                                  lineHeight:
                                    1.5,
                                  color:
                                    "#806F5B",
                                }}
                              >
                                {
                                  risk.reasoning
                                }
                              </p>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      RECOMMENDATION
                  ================================================== */}

                  <section>
                    <SectionHeading eyebrow="The studio's call">
                      Final recommendation
                    </SectionHeading>

                    <div
                      style={{
                        background:
                          "#EFE3CF",
                        border:
                          "1px solid #C7B493",
                        padding:
                          "22px 24px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: 15,
                          lineHeight:
                            1.75,
                          color:
                            "#5D4E40",
                        }}
                      >
                        {
                          data.recommendation
                        }
                      </p>
                    </div>
                  </section>

                  <OrnamentalDivider />

                  {/* ==================================================
                      ALL SOURCES
                  ================================================== */}

                  <section>
                    <SectionHeading eyebrow="Research trail">
                      Sources
                    </SectionHeading>

                    <div
                      style={{
                        background:
                          "#EFE3CF",
                        border:
                          "1px solid #C7B493",
                        padding:
                          "18px 20px",
                        maxHeight: 280,
                        overflowY:
                          "auto",
                      }}
                    >
                      {data.sources
                        .length ===
                      0 ? (
                        <p
                          style={{
                            margin: 0,
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            fontSize:
                              13,
                            color:
                              "#806F5B",
                          }}
                        >
                          No sources
                          returned.
                        </p>
                      ) : (
                        data.sources.map(
                          (
                            source,
                            index
                          ) => (
                            <a
                              key={index}
                              href={
                                source
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  11,
                                lineHeight:
                                  1.5,
                                color:
                                  "#7E403A",
                                textDecoration:
                                  "none",
                                marginBottom:
                                  8,
                                wordBreak:
                                  "break-all",
                              }}
                            >
                              {index + 1}.{" "}
                              {source}
                            </a>
                          )
                        )
                      )}
                    </div>
                  </section>

                  {/* Footer */}
                  <div
                    style={{
                      marginTop: 30,
                      paddingTop: 20,
                      borderTop:
                        "1px solid #BFAE91",
                      textAlign:
                        "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: 11,
                        color:
                          "#927A5D",
                        fontStyle:
                          "italic",
                      }}
                    >
                      End of report ·
                      Agent-generated
                    </p>

                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 12,
                        color:
                          "#A48A67",
                        letterSpacing:
                          "0.2em",
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
                    background:
                      "transparent",
                    border:
                      "1px solid #A99376",
                    color: "#705D48",
                    padding:
                      "10px 20px",
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                    fontSize: 12,
                    cursor: "pointer",
                    letterSpacing:
                      "0.04em",
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