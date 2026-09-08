
import { useMemo } from 'react';
import { mockLogs, getLogStats } from '../../data/mockLogs';

export default function Dashboard() {

  const stats = useMemo(() => getLogStats(mockLogs), []);

  const metrics = [
    { label: 'Total Logs', value: stats.totalLogs, color: '#607A50', symbol: '✦' },
    { label: 'Errors', value: stats.errors, color: '#91483F', symbol: '×' },
    { label: 'Warnings', value: stats.warnings, color: '#B58A45', symbol: '!' },
    {
      label: 'Success Rate',
      value: `${Math.round(((stats.totalLogs - stats.errors) / stats.totalLogs) * 100)}%`,
      color: '#607A50',
      symbol: '✓'
    },
    { label: 'Conversations', value: stats.uniqueConversations, color: '#6D8798', symbol: '☞' },
    { label: 'Input Tokens', value: stats.totalInputTokens.toLocaleString(), color: '#806B8F', symbol: 'I' },
    { label: 'Output Tokens', value: stats.totalOutputTokens.toLocaleString(), color: '#6F6B91', symbol: 'O' },
    {
      label: 'Total Tokens',
      value: (stats.totalInputTokens + stats.totalOutputTokens).toLocaleString(),
      color: '#A86F42',
      symbol: '✧'
    },
  ];

  const finishColors = {
    complete: '#607A50',
    error: '#91483F',
    warning: '#B58A45',
    retry: '#A86F42',
    in_progress: '#6D8798',
    timeout: '#91483F'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px',
        boxSizing: 'border-box',
        background:
          'radial-gradient(circle at 15% 10%, rgba(183,145,91,0.10), transparent 25%), #E8DDC8',
        color: '#382E27',
        fontFamily: "'Trebuchet MS', Arial, sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >

    

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '18px',
          borderTop: '1px solid #6E5A45',
          borderBottom: '1px solid #6E5A45',
          opacity: 0.25,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: '10px',
              height: '10px',
              border: '1px solid #6E5A45',
              borderRadius: '2px'
            }}
          />
        ))}
      </div>

    
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.06,
          backgroundImage:
            'radial-gradient(#5D4C3B 0.6px, transparent 0.6px)',
          backgroundSize: '5px 5px'
        }}
      />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative'
        }}
      >

       
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <p
            style={{
              margin: '0 0 9px',
              fontSize: '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#927653',
              fontWeight: '700'
            }}
          >
            ✦ The Picture Desk · Agent Intelligence ✦
          </p>

          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: '42px',
              lineHeight: '1.05',
              fontWeight: '500',
              margin: 0,
              color: '#382E27',
              letterSpacing: '-0.02em'
            }}
          >
            Agent{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: '#7E403A'
              }}
            >
              Dashboard
            </span>
          </h1>

         
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '500px',
              margin: '16px auto 12px'
            }}
          >
            <span
              style={{
                flex: 1,
                height: '1px',
                background: '#C7B18D'
              }}
            />

            <span
              style={{
                color: '#A68A62',
                fontSize: '12px',
                letterSpacing: '4px'
              }}
            >
              ✦ ◆ ✦
            </span>

            <span
              style={{
                flex: 1,
                height: '1px',
                background: '#C7B18D'
              }}
            />
          </div>

          <p
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: '14px',
              color: '#776653'
            }}
          >
            A quiet look behind the curtain.
          </p>
        </div>

        

        <div
          style={{
            background: '#F5EBD8',
            border: '1px solid #C9B99D',
            boxShadow: '0 15px 40px rgba(76,57,37,0.13)',
            padding: '34px 38px 40px',
            position: 'relative'
          }}
        >

          
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              bottom: '12px',
              border: '1px solid rgba(158,127,87,0.22)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative' }}>

           

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '20px',
                flexWrap: 'wrap',
                marginBottom: '22px'
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 5px',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#967A58',
                    fontWeight: '700'
                  }}
                >
                  Production Intelligence
                </p>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: '24px',
                    fontWeight: '500',
                    color: '#40352B'
                  }}
                >
                  Tonight's figures
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: 'italic',
                  fontSize: '12px',
                  color: '#90775A'
                }}
              >
                Real metrics from {stats.totalLogs} log entries
              </p>
            </div>

           
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '13px',
                marginBottom: '28px'
              }}
            >
              {metrics.map(metric => (
                <div
                  key={metric.label}
                  style={{
                    background: '#FBF4E6',
                    padding: '17px 18px',
                    border: '1px solid #CBB99B',
                    position: 'relative',
                    boxShadow: '0 3px 7px rgba(76,57,37,0.05)'
                  }}
                >

                  <span
                    style={{
                      position: 'absolute',
                      top: '9px',
                      right: '11px',
                      fontSize: '11px',
                      color: metric.color
                    }}
                  >
                    {metric.symbol}
                  </span>

                  <p
                    style={{
                      color: '#927A5D',
                      fontSize: '8px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: '700',
                      margin: '0 0 6px'
                    }}
                  >
                    {metric.label}
                  </p>

                  <p
                    style={{
                      color: metric.color,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: '25px',
                      fontWeight: '500',
                      margin: 0
                    }}
                  >
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

           

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '24px 0'
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#C7B18D'
                }}
              />

              <span style={{ color: '#A68A62', fontSize: '12px' }}>
                ✦ ◆ ✦
              </span>

              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#C7B18D'
                }}
              />
            </div>

            

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '25px'
              }}
            >

            

              <div
                style={{
                  background: '#FBF4E6',
                  padding: '22px 23px',
                  border: '1px solid #CBB99B'
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: '8px',
                    letterSpacing: '0.17em',
                    textTransform: 'uppercase',
                    color: '#967A58',
                    fontWeight: '700'
                  }}
                >
                  How the curtain fell
                </p>

                <h3
                  style={{
                    color: '#40352B',
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: '21px',
                    fontWeight: '500',
                    margin: '0 0 18px'
                  }}
                >
                  Finish Reasons
                </h3>

                {Object.entries(stats.finishReasons).map(
                  ([reason, count]) => {
                    const percentage = Math.round(
                      (count / stats.totalLogs) * 100
                    );

                    return (
                      <div
                        key={reason}
                        style={{
                          marginBottom: '14px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px'
                          }}
                        >
                          <span
                            style={{
                              color: '#655747',
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",
                              fontSize: '13px',
                              textTransform: 'capitalize'
                            }}
                          >
                            {reason.replace(/_/g, ' ')}
                          </span>

                          <span
                            style={{
                              color: '#806B55',
                              fontSize: '11px'
                            }}
                          >
                            {count} ({percentage}%)
                          </span>
                        </div>

                        <div
                          style={{
                            width: '100%',
                            height: '5px',
                            background: '#E5D9C4',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background:
                                finishColors[reason] || '#806B55',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

            
              <div
                style={{
                  background: '#FBF4E6',
                  padding: '22px 23px',
                  border: '1px solid #CBB99B'
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: '8px',
                    letterSpacing: '0.17em',
                    textTransform: 'uppercase',
                    color: '#967A58',
                    fontWeight: '700'
                  }}
                >
                  What's happening backstage
                </p>

                <h3
                  style={{
                    color: '#40352B',
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: '21px',
                    fontWeight: '500',
                    margin: '0 0 18px'
                  }}
                >
                  Event Distribution
                </h3>

                {Object.entries(stats.eventNames)
                  .sort((a, b) => b[1] - a[1])
                  .map(([event, count], index) => (
                    <div
                      key={event}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '9px 2px',
                        borderBottom: '1px dotted #C7B493'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center'
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            fontSize: '11px',
                            color: '#A38A68'
                          }}
                        >
                          0{index + 1}
                        </span>

                        <span
                          style={{
                            color: '#655747',
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            fontSize: '13px',
                            textTransform: 'capitalize'
                          }}
                        >
                          {event.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <span
                        style={{
                          color: '#40352B',
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize: '14px'
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

           

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '24px 0'
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#C7B18D'
                }}
              />

              <span style={{ color: '#A68A62', fontSize: '12px' }}>
                ✦ ◆ ✦
              </span>

              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#C7B18D'
                }}
              />
            </div>

           

            <div
              style={{
                background: '#EDE2CE',
                padding: '24px 25px',
                border: '1px solid #C7B493'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: '15px',
                  flexWrap: 'wrap',
                  marginBottom: '17px'
                }}
              >
                <div>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '8px',
                      letterSpacing: '0.17em',
                      textTransform: 'uppercase',
                      color: '#967A58',
                      fontWeight: '700'
                    }}
                  >
                    Latest dispatches
                  </p>

                  <h3
                    style={{
                      color: '#40352B',
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: '21px',
                      fontWeight: '500',
                      margin: 0
                    }}
                  >
                    Recent Activity
                  </h3>
                </div>

                <span
                  style={{
                    color: '#90775A',
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                    fontSize: '11px',
                    fontStyle: 'italic'
                  }}
                >
                  Last five entries
                </span>
              </div>

              {mockLogs.slice(0, 5).map((log, index) => (
                <div
                  key={log.insertId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '35px 1fr auto',
                    gap: '13px',
                    alignItems: 'center',
                    padding: '12px 2px',
                    borderBottom:
                      index !== 4
                        ? '1px dotted #C7B493'
                        : 'none'
                  }}
                >

                 

                  <span
                    style={{
                      color: '#A38A68',
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: '11px'
                    }}
                  >
                    0{index + 1}
                  </span>

                  {/* Log */}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      minWidth: 0
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 8px',
                        border: `1px solid ${
                          log.severity === 'ERROR'
                            ? '#91483F'
                            : log.severity === 'WARNING'
                            ? '#B58A45'
                            : '#607A50'
                        }`,
                        color:
                          log.severity === 'ERROR'
                            ? '#91483F'
                            : log.severity === 'WARNING'
                            ? '#B58A45'
                            : '#607A50',
                        fontSize: '8px',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {log.severity}
                    </span>

                    <span
                      style={{
                        color: '#5D5042',
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontSize: '13px',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {log.textPayload.length > 50
                        ? log.textPayload.substring(0, 50) + '...'
                        : log.textPayload}
                    </span>
                  </div>

                  {/* Time */}

                  <span
                    style={{
                      color: '#927A5D',
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: '10px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>

           

            <div
              style={{
                textAlign: 'center',
                marginTop: '30px',
                paddingTop: '18px',
                borderTop: '1px solid #C7B493'
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#927A5D',
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize: '11px',
                  fontStyle: 'italic'
                }}
              >
                The Picture Desk · Agent performance archive
              </p>

              <div
                style={{
                  marginTop: '9px',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  color: '#A38A68'
                }}
              >
                ✦ · ✦ · ✦
              </div>
            </div>

          </div>
        </div>

       
        <p
          style={{
            textAlign: 'center',
            marginTop: '22px',
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            fontSize: '10px',
            color: '#9B8569',
            fontStyle: 'italic'
          }}
        >
          Confidential production records · Est. 2026
        </p>
      </div>
    </div>
  );
}

