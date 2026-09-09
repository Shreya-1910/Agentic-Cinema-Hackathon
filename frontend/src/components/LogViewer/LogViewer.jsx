import { useEffect, useState } from "react";
import {
  getAppLogs,
  clearAppLogs,
  subscribeToAppLogs,
  addAppLog,
} from "../../utils/appLogs";

const API_URL = "http://127.0.0.1:8000";

function LogEntry({ log }) {
  const levelStyles = {
    INFO: {
      background: "#eee8dc",
      color: "#4a443d",
    },
    SUCCESS: {
      background: "#e2eadf",
      color: "#38533d",
    },
    WARN: {
      background: "#f1e5cc",
      color: "#765d2d",
    },
    ERROR: {
      background: "#ead8d5",
      color: "#7a3933",
    },
  };

  const style = levelStyles[log.level] || levelStyles.INFO;

  return (
    <div
      style={{
        padding: "18px 20px",
        borderBottom: "1px solid rgba(72, 52, 43, 0.12)",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            letterSpacing: "1.5px",
            padding: "5px 9px",
            borderRadius: "2px",
            background: style.background,
            color: style.color,
          }}
        >
          {log.level}
        </span>

        <span
          style={{
            fontSize: "11px",
            color: "#8b8176",
            letterSpacing: "0.5px",
          }}
        >
          {log.timestamp}
        </span>
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "#3f3731",
          fontWeight: "bold",
          marginBottom: log.detail ? "7px" : "0",
        }}
      >
        {log.message}
      </div>

      {log.detail && (
        <div
          style={{
            fontSize: "12px",
            color: "#766c62",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {log.detail}
        </div>
      )}
    </div>
  );
}

export default function LogViewer() {
  const [logs, setLogs] = useState(() => getAppLogs());
  const [checking, setChecking] = useState(false);
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAppLogs(() => {
      setLogs(getAppLogs());
    });

    return unsubscribe;
  }, []);

  async function checkBackend() {
    if (checking) return;

    setChecking(true);

    addAppLog(
      "INFO",
      "Checking backend connection",
      `${API_URL}/health`
    );

    try {
      const response = await fetch(`${API_URL}/health`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Backend returned HTTP ${response.status}`
        );
      }

      setConnected(true);

      addAppLog(
        "SUCCESS",
        "Backend connection established",
        JSON.stringify(data)
      );
    } catch (error) {
      setConnected(false);

      addAppLog(
        "ERROR",
        "Backend connection failed",
        error.message
      );
    } finally {
      setChecking(false);
    }
  }

  function handleClearLogs() {
    clearAppLogs();
    setLogs([]);
  }

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#eee7d9",
        padding: "35px",
        color: "#40372f",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#8a786b",
              marginBottom: "10px",
            }}
          >
            AGENTIC CINEMA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              fontWeight: "normal",
              letterSpacing: "1px",
            }}
          >
            Production Log
          </h1>

          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              color: "#766b61",
              fontStyle: "italic",
            }}
          >
            Live application telemetry
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              fontSize: "12px",
              color: "#6e635a",
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                display: "inline-block",
                background:
                  connected === true
                    ? "#4d7755"
                    : connected === false
                    ? "#9a4d45"
                    : "#9a8d80",
              }}
            />

            {connected === true
              ? "Backend connected"
              : connected === false
              ? "Backend unavailable"
              : "Connection not checked"}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={checkBackend}
              disabled={checking}
              style={{
                border: "1px solid #75645a",
                background: "#e4dccd",
                color: "#493f37",
                padding: "9px 15px",
                fontFamily: "Georgia, serif",
                fontSize: "12px",
                cursor: checking ? "default" : "pointer",
              }}
            >
              {checking ? "Checking..." : "Check backend"}
            </button>

            <button
              onClick={handleClearLogs}
              style={{
                border: "1px solid #9b8d80",
                background: "transparent",
                color: "#6f6259",
                padding: "9px 15px",
                fontFamily: "Georgia, serif",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Clear logs
            </button>
          </div>
        </div>

        {/* Log window */}
        <div
          style={{
            background: "#f7f2e9",
            border: "1px solid rgba(72, 52, 43, 0.18)",
            boxShadow: "0 8px 25px rgba(55, 42, 35, 0.08)",
          }}
        >
          {/* Window header */}
          <div
            style={{
              padding: "13px 18px",
              borderBottom:
                "1px solid rgba(72, 52, 43, 0.14)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#e7dfd1",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                fontWeight: "bold",
              }}
            >
              APPLICATION ACTIVITY
            </span>

            <span
              style={{
                fontSize: "10px",
                color: "#84786e",
              }}
            >
              {logs.length} {logs.length === 1 ? "event" : "events"}
            </span>
          </div>

          {/* Entries */}
          {logs.length === 0 ? (
            <div
              style={{
                padding: "65px 25px",
                textAlign: "center",
                color: "#94887d",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "12px",
                }}
              >
                ◇
              </div>

              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                No activity recorded
              </div>

              <div
                style={{
                  fontSize: "11px",
                  fontStyle: "italic",
                }}
              >
                Run a Greenlight analysis to see live application events.
              </div>
            </div>
          ) : (
            logs.map((log) => (
              <LogEntry
                key={log.id}
                log={log}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
            fontSize: "10px",
            color: "#978b80",
            letterSpacing: "1px",
          }}
        >
          REAL APPLICATION EVENTS · NO MOCK DATA
        </div>
      </div>
    </div>
  );
}