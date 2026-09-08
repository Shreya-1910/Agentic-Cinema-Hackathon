import { useState, useMemo } from 'react';
import { mockLogs } from '../../data/mockLogs';

export default function LogViewer() {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logs based on severity and search
  const filteredLogs = useMemo(() => {
    let logs = mockLogs;

    if (filter !== 'ALL') {
      logs = logs.filter(log => log.severity === filter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      logs = logs.filter(log =>
        log.textPayload.toLowerCase().includes(term) ||
        log.labels?.gen_ai_conversation_id?.includes(term) ||
        log.labels?.event_name?.toLowerCase().includes(term)
      );
    }

    return logs;
  }, [filter, searchTerm]);

  // Count severity types
  const severityCounts = {
    ALL: mockLogs.length,
    INFO: mockLogs.filter(l => l.severity === 'INFO').length,
    WARNING: mockLogs.filter(l => l.severity === 'WARNING').length,
    ERROR: mockLogs.filter(l => l.severity === 'ERROR').length,
  };

  const severityStyles = {
    INFO: {
      background: '#DDE4C8',
      color: '#46513A',
      icon: '●',
    },
    WARNING: {
      background: '#E9D5A6',
      color: '#735829',
      icon: '▲',
    },
    ERROR: {
      background: '#E3B9AD',
      color: '#793D34',
      icon: '✦',
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '42px 48px',
        background: '#F1E8D5',
        color: '#342F29',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >


      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          border: '35px solid #D9C9AC',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-80px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '45px solid #D9C9AC',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#8B6F47',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Behind the Scenes
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '38px',
              fontWeight: '600',
              color: '#332D27',
              letterSpacing: '-1px',
            }}
          >
            Agent Logs
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#756D62',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
            }}
          >
             Everything happening behind the scenes
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '15px',
              color: '#9A8C78',
            }}
          >
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#F8F2E5',
              border: '1px solid #CDBFA7',
              borderRadius: '24px',
              padding: '11px 18px 11px 38px',
              color: '#342F29',
              fontSize: '13px',
              width: '260px',
              outline: 'none',
              fontFamily: 'Arial, sans-serif',
              boxShadow: '0 2px 5px rgba(74, 58, 39, 0.06)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          color: '#B09B7A',
        }}
      >
        <div
          style={{
            height: '1px',
            flex: 1,
            background: '#CDBFA7',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: '5px',
          }}
        >
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#B09B7A',
              }}
            />
          ))}
        </div>

        <div
          style={{
            height: '1px',
            flex: 1,
            background: '#CDBFA7',
          }}
        />
      </div>

      {/* Filter + result count */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {['ALL', 'INFO', 'WARNING', 'ERROR'].map(severity => {
            const active = filter === severity;
            const style =
              severityStyles[severity] || {
                background: '#DED5C2',
                color: '#5F564A',
              };

            return (
              <button
                key={severity}
                onClick={() => setFilter(severity)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: active
                    ? '1px solid #8B6F47'
                    : '1px solid #D2C5AE',
                  background: active
                    ? '#8B6F47'
                    : '#F8F2E5',
                  color: active ? '#FFF9EC' : '#756D62',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease',
                  boxShadow: active
                    ? '0 2px 5px rgba(74, 58, 39, 0.12)'
                    : 'none',
                }}
              >
                {severity === 'ALL' ? 'ALL SCENES' : severity}
                <span
                  style={{
                    marginLeft: '6px',
                    opacity: 0.7,
                  }}
                >
                  {severityCounts[severity]}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#8C8172',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Showing <strong>{filteredLogs.length}</strong> of{' '}
          <strong>{mockLogs.length}</strong> scenes
        </div>
      </div>

      {/* Logs table */}
      <div
        style={{
          background: '#F8F2E5',
          border: '1px solid #D0C2AA',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 5px 18px rgba(70, 54, 35, 0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Table title bar */}
        <div
          style={{
            padding: '14px 18px',
            background: '#3C3933',
            color: '#F4E9D3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
            }}
          >
            ◉ Production Log
          </div>

          <div
            style={{
              fontSize: '10px',
              color: '#C9BFAE',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            ROLLING · LIVE
          </div>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead
            style={{
              background: '#EDE3D0',
              borderBottom: '1px solid #D6C8B1',
            }}
          >
            <tr>
              {[
                'Severity',
                'Event',
                'Message',
                'Conversation',
                'Tokens',
                'Time',
              ].map(header => (
                <th
                  key={header}
                  style={{
                    padding: '13px 14px',
                    textAlign: 'left',
                    color: '#756A5B',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '55px',
                    textAlign: 'center',
                    color: '#8B8174',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '13px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      marginBottom: '8px',
                    }}
                  >
                    🎞
                  </div>
                  No scenes found matching your filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => {
                const inputTokens = parseInt(
                  log.labels?.gen_ai_usage_input_tokens || '0',
                  10
                );

                const outputTokens = parseInt(
                  log.labels?.gen_ai_usage_output_tokens || '0',
                  10
                );

                const totalTokens = inputTokens + outputTokens;

                const severity =
                  severityStyles[log.severity] || severityStyles.INFO;

                return (
                  <tr
                    key={log.insertId}
                    style={{
                      borderBottom:
                        index === filteredLogs.length - 1
                          ? 'none'
                          : '1px solid #E0D5C2',
                    }}
                  >
                    {/* Severity */}
                    <td
                      style={{
                        padding: '15px 14px',
                        verticalAlign: 'top',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 9px',
                          borderRadius: '5px',
                          fontSize: '9px',
                          fontFamily: 'Arial, sans-serif',
                          fontWeight: 'bold',
                          letterSpacing: '0.7px',
                          background: severity.background,
                          color: severity.color,
                        }}
                      >
                        <span style={{ fontSize: '8px' }}>
                          {severity.icon}
                        </span>
                        {log.severity}
                      </span>
                    </td>

                    {/* Event */}
                    <td
                      style={{
                        padding: '15px 14px',
                        color: '#716758',
                        fontSize: '12px',
                        fontFamily: 'Arial, sans-serif',
                        verticalAlign: 'top',
                      }}
                    >
                      {log.labels?.event_name || '—'}
                    </td>

                    {/* Message */}
                    <td
                      style={{
                        padding: '15px 14px',
                        color: '#3C3831',
                        fontSize: '13px',
                        lineHeight: '1.45',
                        maxWidth: '380px',
                        verticalAlign: 'top',
                      }}
                    >
                      {log.textPayload}
                    </td>

                    {/* Conversation */}
                    <td
                      style={{
                        padding: '15px 14px',
                        color: '#817667',
                        fontSize: '11px',
                        fontFamily: "'Courier New', monospace",
                        verticalAlign: 'top',
                      }}
                    >
                      {log.labels?.gen_ai_conversation_id
                        ? `${log.labels.gen_ai_conversation_id.slice(0, 8)}...`
                        : '—'}
                    </td>

                    {/* Tokens */}
                    <td
                      style={{
                        padding: '15px 14px',
                        color: '#655B4D',
                        fontSize: '12px',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: '600',
                        verticalAlign: 'top',
                      }}
                    >
                      {totalTokens > 0
                        ? totalTokens.toLocaleString()
                        : '—'}
                    </td>

                    {/* Time */}
                    <td
                      style={{
                        padding: '15px 14px',
                        color: '#8A7F70',
                        fontSize: '11px',
                        fontFamily: 'Arial, sans-serif',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'top',
                      }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#9A8D7A',
          fontSize: '10px',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '0.5px',
        }}
      >
        <span>
          ✦ ARCHIVE 
        </span>

      </div>
    </div>
  );
}